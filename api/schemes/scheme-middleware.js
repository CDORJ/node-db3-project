const Scheme = require("./scheme-model.js");

/*
  If `scheme_id` does not exist in the database:

  status 404
  {
    "message": "scheme with scheme_id <actual id> not found"
  }
*/
const checkSchemeId = async (req, res, next) => {
  const { id } = req.params;
  try {
    const scheme = await Scheme.findById(id);
    req.scheme = scheme;
    next();
  } catch (err) {
    err.status = 404;
    err.message = `${id} is not a valid id`;
    next(err);
  }
};

/*
  If `scheme_name` is missing, empty string or not a string:

  status 400
  {
    "message": "invalid scheme_name"
  }
*/
const validateScheme = (req, res, next) => {
  const body = req.body;
  if (!body.scheme_name || typeof body.scheme_name !== "string" || body.scheme_name.length <= 1) {
    const err = new Error();
    err.status = 400;
    err.message = `Request must contain a scheme_name`;
    next(err);
  } else {
    next();
  }
};

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = (req, res, next) => {
  const body = req.body;
  if (!body.instructions || typeof body.instructions !== "string") {
    const err = new Error();
    err.status = 400;
    err.message = `Instructions are required`;
    next(err);
  } else if (!body.step_number || typeof body.step_number !== "number" || body.step_number.length <= 1) {
    const err = new Error();
    err.status = 400;
    err.message = `step_number is a required number and must be greater than 1`;
    next(err)
  } else {
    next()
  };
};

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
};
