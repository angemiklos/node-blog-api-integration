const chai = require('chai');
const chaiHttp = require('chai-http');

const{app, runServer, closeServer} = require('../server');

// using expect for testing
const expect = chai.expect;

// used to make HTTP requests for testing
chai.use(chaiHttp);

// this is the test block for the CRUD
describe('Blog Post', function() {

    before(function() {
        return runServer();
    });

    after(function() {
        return closeServer();
    });

    // these are the individual tests

    // testing GET request
    it('should list blogs on GET', function() {
        return chai.request(app)
          .get('/blog-posts')
          .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('array');
            expect(res.body.length).to.be.at.least(1);
            
            const expectedKeys = ['id','title', 'content', 'author', 'publishDate'];
            res.body.forEach(function(item) {
                expect(item).to.be.a('object');
                expect(item).to.include.keys(expectedKeys);
            });
          });
    });

    // testing POST request
    // TODO: am I allowed to bring models in to call create()?
    it('should add a blog on POST', function() {
        const newItem = {
            title: 'aphids',
            content: 'Aphids can be a real problem for roses!',
            author: 'Jane Doe',
            publishDate: Date.now()
        };
        return chai.request(app)
          .post('/blog-posts')
          .send(newItem)
          .then(function(res) {
              expect(res).to.have.status(201);
              expect(res).to.be.json;
              expect(res.body.id).to.not.equal(null);

              const expectedKeys = ['id','title', 'content', 'author', 'publishDate'];
              expect(res.body).to.be.a('object');
              expect(res.body).to.include.keys(expectedKeys);
            });
    });

    // testing PUT request
    it('should update a blog on PUT', function() {
        const updateItem = {
            title : 'Update this title',
            content : 'Update this content',
            author : 'Rumplestilskin',
            publishDate : Date.now()
        };
        return chai.request(app)
          get('/blog-posts')
          .then(function(res) {
              updateItem.id = res.body[0].id;

              return chai.request(app)
                .put('/blog-posts/${updateItem.id}')
                .send(updateItem);
          });
    });

    // testing DELETE request
    it('should remove a blog on DELETE', function() {
        return chai.request(app)
          .get('/blog-posts')
          .then(function(res) {
             return chai.request(app)
               .delete('/blog-posts/${res.body[0].id}')
        })
        .then(function(res) {
            expect(res).to.have.status(204);
        });
    });
});