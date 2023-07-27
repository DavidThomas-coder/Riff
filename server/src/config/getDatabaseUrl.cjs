const getDatabaseUrl = (nodeEnv) => {
  return (
    {
      development: "postgres://postgres:postgres@localhost:5432/riff_development",
      test: "postgres://postgres:postgres@localhost:5432/riff_test",
      e2e: "postgres://postgres:postgres@localhost:5432/riff_e2e",
    }[nodeEnv] || process.env.DATABASE_URL
  );
};

module.exports = getDatabaseUrl;
