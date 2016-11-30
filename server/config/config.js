module.exports = process.env.NODE_ENV === 'production' ? 
                  'https://beltless-trenchcoats.herokuapp.com' : 
                  'http://localhost:8080';