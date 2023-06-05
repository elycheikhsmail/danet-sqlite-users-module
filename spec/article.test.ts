import { bootstrap } from '../src/bootstrap.ts';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  it,
} from 'https://deno.land/std@0.140.0/testing/bdd.ts';
import {
  assertArrayIncludes,
  assertEquals,
  assertExists,
} from 'https://deno.land/std@0.140.0/testing/asserts.ts';
//import { Article } from '../src/Article/class.ts';
import { Article } from '../src/articles/class.ts';
//import { ArticleService } from '../src/Article/service.ts';
import { ArticleService } from '../src/articles/service.ts';
import { DanetApplication } from 'danet/mod.ts';

let app: DanetApplication;
let server;
let articleService: ArticleService;
let port: number;
const payload: Omit<Article, '_id'> = {
  title: 'my Article',
  content: 'long enough content for passing validation',
  price: 4500,
};
describe('Article', () => {
  beforeAll(async () => {
    app = await bootstrap();
    server = await app.listen(0);
    articleService = await app.get<ArticleService>(ArticleService);
    port = server.port;

    // we need this to make oak listen outside of any test to not leak
    const res = await fetch(`http://localhost:${port}`);
    await res.text();
  });

  afterEach(async () => {
    await articleService.deleteAll();
  });

  afterAll(async () => {
    await app.close();
  });

  it('simple Article creation', async () => {
    const res = await fetch(`http://localhost:${port}/Article`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    const returnedData: Article = await res.json();
    console.log('id: ', returnedData._id);
    assertExists(returnedData._id);
    assertEquals(returnedData.title, payload.title);
    assertEquals(returnedData.content, payload.content);
  });

  it('get an HTTP 400 error is body is not well formatted', async () => {
    const res = await fetch(`http://localhost:${port}/Article`, {
      method: 'POST',
      body: JSON.stringify({
        title: 'my Article',
        content: 'tooshortcontent',
      }),
    });
    const returnedData: { reasons: unknown[] } = await res.json();
    assertArrayIncludes(returnedData.reasons, [{
      'property': 'content',
      'errorMessage': 'Length must be greater than 20',
      'constraints': [
        20,
      ],
    }]);
  });

  it('get all Articles', async () => {
    const firstAdded = await articleService.create({
      title: 'first Article',
      content: 'first content',
      price: 3500,
    });
    const secondAdded = await articleService.create({
      title: 'second Article',
      content: 'second content',
      price: 5600,
    });

    const res = await fetch(`http://localhost:${port}/Article`, {
      method: 'GET',
    });

    const returnedData: Article[] = await res.json();
    console.log({ returnedData });
    assertEquals(returnedData.length, 2);
    const plainArray = JSON.parse(JSON.stringify([firstAdded, secondAdded]));
    assertArrayIncludes(returnedData, plainArray);
  });

  it('get one Article by id', async () => {
    const firstAdded = await articleService.create({
      title: 'first Article',
      content: 'first content',
      price: 4590,
    });

    const res = await fetch(
      `http://localhost:${port}/Article/${firstAdded._id}`,
      {
        method: 'GET',
      },
    );
    const returnedArticle: Article = await res.json();
    const plainObject = JSON.parse(JSON.stringify(firstAdded));

    assertEquals(returnedArticle, plainObject);
  });

  it('update one Article by id', async () => {
    const firstAdded = await articleService.create({
      title: 'first Article',
      content: 'content is long enough for validation again',
      price: 4600,
    });
    await (await fetch(`http://localhost:${port}/Article/${firstAdded._id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: 'newtitle',
        content: 'content is long enough for validation again',
        price: 3400,
      }),
    })).text();
    const returnedArticle =
      await (await fetch(`http://localhost:${port}/Article/${firstAdded._id}`, {
        method: 'GET',
      })).json();

    assertEquals(returnedArticle.title, 'newtitle');
  });

  it('delete one Article', async () => {
    const firstAdded = await articleService.create({
      title: 'first Article',
      content: 'first content',
      price: 5690,
    });

    const res = await fetch(
      `http://localhost:${port}/Article/${firstAdded._id}`,
      {
        method: 'DELETE',
      },
    );
    await res.text();

    assertEquals(await articleService.getById(firstAdded._id), undefined);
  });
});
