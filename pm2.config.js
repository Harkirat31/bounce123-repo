module.exports = {
    apps: [
      {
        name: "express",
        script: "npm",
        args: "run start:express",
      },
      {
        name: "react",
        script: "npm",
        args: "run start:react",
      },
      {
        name: "website",
        script: "npm",
        args: "run start:website",
      },
    ],
  };
  