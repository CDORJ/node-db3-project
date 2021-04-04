const db = require("../../data/db-config.js");

async function find() {
  // EXERCISE A
  /*
    1A- Study the SQL query below running it in SQLite Studio against `data/schemes.db3`.
    What happens if we change from a LEFT join to an INNER join?

      SELECT
          sc.*,
          count(st.step_id) as number_of_steps
      FROM schemes as sc
      LEFT JOIN steps as st
          ON sc.scheme_id = st.scheme_id
      GROUP BY sc.scheme_id
      ORDER BY sc.scheme_id ASC;

    2A- When you have a grasp on the query go ahead and build it in Knex.
    Return from this function the resulting dataset.
  */

  // returns the database, schemes is renamed as 'sc'
  return await db("schemes as sc")
    // returns all results from the left table (steps as st) and the matching rows from the right table (scheme) even if there is no match
    .leftJoin("steps as st", "sc.scheme_id", "st.scheme_id")
    // select and display the scheme_id from schemes and schemes scheme_name
    .select("sc.scheme_id", "sc.scheme_name")
    .count("st.step_id", { as: "number of steps" })
    // helpful https://www.essentialsql.com/what-is-the-difference-between-group-by-and-order-by/#:~:text=To%20summarize%2C%20the%20key%20difference,be%20used%20to%20form%20summaries.
    .groupBy("sc.scheme_id")
    // display in ascending order by the scheme scheme_id , every row in the table is included in the result
    .orderBy("sc.scheme_id");
}

async function findById(scheme_id) {
  // EXERCISE B
  /*
    1B- Study the SQL query below running it in SQLite Studio against `data/schemes.db3`:

      SELECT
          sc.scheme_name,
          st.*
      FROM schemes as sc
      LEFT JOIN steps as st
          ON sc.scheme_id = st.scheme_id
      WHERE sc.scheme_id = 1
      ORDER BY st.step_number ASC;

    2B- When you have a grasp on the query go ahead and build it in Knex
    making it parametric: instead of a literal `1` you should use `scheme_id`.

    3B- Test in Postman and see that the resulting data does not look like a scheme,
    but more like an array of steps each including scheme information:

      [
        {
          "scheme_id": 1,
          "scheme_name": "World Domination",
          "step_id": 2,
          "step_number": 1,
          "instructions": "solve prime number theory"
        },
        {
          "scheme_id": 1,
          "scheme_name": "World Domination",
          "step_id": 1,
          "step_number": 2,
          "instructions": "crack cyber security"
        },
        // etc
      ]

    4B- Using the array obtained and vanilla JavaScript, create an object with
    the structure below, for the case _when steps exist_ for a given `scheme_id`:

      {
        "scheme_id": 1,
        "scheme_name": "World Domination",
        "steps": [
          {
            "step_id": 2,
            "step_number": 1,
            "instructions": "solve prime number theory"
          },
          {
            "step_id": 1,
            "step_number": 2,
            "instructions": "crack cyber security"
          },
          // etc
        ]
      }

    5B- This is what the result should look like _if there are no steps_ for a `scheme_id`:

      {
        "scheme_id": 7,
        "scheme_name": "Have Fun!",
        "steps": []
      }
  */

  // return schemes database as sc
  const scheme = await db("schemes as sc")
    .where({ "sc.scheme_id": scheme_id })
    // returns all results from the left table (steps as st) and the matching rows from the right table (sc.scheme_id matching st.scheme_id) even if there is no match
    .leftJoin("steps as st", "sc.scheme_id", "st.scheme_id")
    // select all of the below and display
    .select(
      "sc.scheme_id",
      "sc.scheme_name",
      "st.step_id",
      "st.step_number",
      "st.instructions"
    )
    // REVIEW still confused by the difference in groupBy and orderBy
    .groupBy("st.step_number")
    // order the results by steps step_number
    .orderBy("st.step_number");

  // creating a new object
  const newObj = {
    // assigning new values to new object at the beginning of array
    scheme_id: scheme[0].scheme_id,
    scheme_name: scheme[0].scheme_name,
    steps:
      // if there is a new scheme step_id map over and return found step with number, id, and instructions
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

  // return new object
  return newObj;
}

async function findSteps(scheme_id) {
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
  // asychronously return schemes db
  return await db("schemes as sc")
    // REVIEW
    .where({ "sc.scheme_id": scheme_id })
    // select and display all of the below
    .select("st.step_id", "st.step_number", "st.instructions", "sc.scheme_name")
    // join steps as st, and return matching values of scheme.scheme_id and steps.scheme_id
    .join("steps as st", "sc.scheme_id", "st.scheme_id")
    // display in ascending order by steps.step_number
    .orderBy("st.step_number");
}

async function add(scheme) {
  // EXERCISE D
  /*
    1D- This function creates a new scheme and resolves to _the newly created scheme_.
  */
  // insert new scheme
  const [id] = await db("schemes").insert(scheme);
  // return the corresponding new scheme in relation to the id, spread and copy over previous values
  return { id, ...scheme };
}

async function addStep(scheme_id, steps) {
  // EXERCISE E
  /*
    1E- This function adds a step to the scheme with the given `scheme_id`
    and resolves to _all the steps_ belonging to the given `scheme_id`,
    including the newly created one.
  */

  //creating a newStep with the given id and copying over the previous steps
  const newStep = { scheme_id, ...steps };
  //

  // insert newStep into steps database asychronously
  await db("steps as st").insert(newStep);

  // return previously created findSteps(return given step via scheme_id)
  return findSteps(scheme_id);
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
};
