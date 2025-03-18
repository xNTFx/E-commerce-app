const apiURL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://api.e-commerce-app.pawelsobon.pl';

export default apiURL;
