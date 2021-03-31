const db = require("../../data/db-config.js");

async function find() {
  return await db("schemes as sc")
    .leftJoin("steps as st", "sc.scheme_id", "st.scheme_id")
    .select("sc.scheme_id", "sc.scheme_name")
    .count("st.step_id", { as: "number of steps" })
    .groupBy("sc.scheme_id")
    .orderBy("sc.scheme_id");
}

async function findById(scheme_id) {
  const scheme = await db("schemes as sc")
    .where({ "sc.scheme_id": scheme_id })
    .leftJoin("steps as st", "sc.scheme_id", "st.scheme_id")
    .select(
      "sc.scheme_id",
      "sc.scheme_name",
      "st.step_id",
      "st.step_number",
      "st.instructions"
    )
    .groupBy("st.step_number")
    .orderBy("st.step_number");
  const newObj = {
    scheme_id: scheme[0].scheme_id,
    scheme_name: scheme[0].scheme_name,
    steps:
      scheme[0].step_id !== null
        ? scheme.map((step) => {
            return {
              step_number: step.step_number,
              step_id: step.step_id,
              instructions: step.instructions,
            };
          })
        : [],
  };
  return newObj;
  // EXERCISE B
  /*


    5B- This is what the result should look like _if there are no steps_ for a `scheme_id`:

      {
        "scheme_id": 7,
        "scheme_name": "Have Fun!",
        "steps": []
      }
  */
}

async function findSteps(scheme_id) {
  return await db("schemes as sc")
    .where({ "sc.scheme_id": scheme_id })
    .select("st.step_id", "st.step_number", "st.instructions", "sc.scheme_name")
    .join("steps as st", "sc.scheme_id", "st.scheme_id")
    .orderBy("st.step_number");
  // EXERCISE C
  /*
    1C- Build a query in Knex that returns the following data.
    The steps should be sorted by step_number, and the array
    should be empty if there are no steps for the scheme:

      [
        {
          "step_id": 5,
          "step_number": 1,
          "instructions": "collect all the sheep in Scotland",
          "scheme_name": "Get Rich Quick"
        },
        {
          "step_id": 4,
          "step_number": 2,
          "instructions": "profit",
          "scheme_name": "Get Rich Quick"
        }
      ]
  */
}

async function add(scheme) {
  const [id] = await db("schemes").insert(scheme);
  return { id, ...scheme };

  // EXERCISE D
  /*
    1D- This function creates a new scheme and resolves to _the newly created scheme_.
  */
}

async function addStep(scheme_id, steps) {
  const newStep = { scheme_id, ...steps };
  await db("steps as st").insert(newStep);

  return findSteps(scheme_id);
}
// EXERCISE E
/*
    1E- This function adds a step to the scheme with the given `scheme_id`
    and resolves to _all the steps_ belonging to the given `scheme_id`,
    including the newly created one.
      
      "step_id": 12,
      "step_number": 1,
      "instructions": "quest and quest some more",
      "scheme_name": "Find the Holy Grail"
  */

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
};
