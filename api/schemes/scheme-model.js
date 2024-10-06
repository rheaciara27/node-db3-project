const db = require('../../data/db-config');

async function find() { // EXERCISE A
  const result = await db({ sc: 'schemes' })
    .leftJoin({ st: 'steps' }, 'sc.scheme_id', 'st.scheme_id')
    .groupBy('sc.scheme_id')
    .orderBy('sc.scheme_id')
    .count({ number_of_steps: 'st.step_id' })
    .select('sc.*')
  return result;
}

async function findById(id) { // EXERCISE B
  const data = await db({ sc: 'schemes' })
    .leftJoin({ st: 'steps' }, 'sc.scheme_id', 'st.scheme_id')
    .where({ 'sc.scheme_id': id })
    .orderBy('st.step_number')
    .select(
      'step_id',
      'step_number',
      'instructions',
      'sc.scheme_name',
      'sc.scheme_id as scheme_id'
    );
  const result = data.reduce((acc, row) => {
    if (row.instructions) {
      acc.steps.push({
        step_id: row.step_id,
        step_number: row.step_number,
        instructions: row.instructions
      })
    }
    return acc;
  }, {
    scheme_id: data[0].scheme_id,
    scheme_name: data[0].scheme_name,
    steps: []
  });
  return result;
}

async function findSteps(scheme_id) { // EXERCISE C
  const result = await db('steps as st')
    .join('schemes as sc', 'st.scheme_id', 'sc.scheme_id')
    .where('st.scheme_id', scheme_id)
    .orderBy('step_number')
    .select('step_id', 'step_number', 'instructions', 'scheme_name')
  return result;
}

async function add(scheme) { // EXERCISE D
  const result = await db('schemes')
    .insert(scheme);
  const newScheme = await db('schemes')
    .where('scheme_id', result)
    .first();
  return newScheme;
}

async function addStep(scheme_id, step) { // EXERCISE E
  const { instructions, step_number } = step; 
  await db('steps')
    .insert({ scheme_id, instructions, step_number });
  const allSteps = await findSteps(scheme_id);
  return allSteps;
}

async function checkId(scheme_id) {
  const result = await db('schemes')
    .where('scheme_id', scheme_id)
    .first();
  return result;
}

module.exports = {   
  find,
  findById,
  findSteps,
  add,
  addStep,
  checkId
}
