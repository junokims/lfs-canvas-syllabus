const {
  getAllCourseSyllabiInAccount,
  getOptions,
  getUsersInCourse
} = require('node-canvas-api')
const { flatten } = require('ramda')
const path = require('path')
const { writeHeader, append } = require('write-to-csv')

const noSyllabus = x => x.syllabus === null || x.syllabus === ''

const getInstructors = courses => Promise.all(
  courses.map(({ courseId, courseCode, term }) =>
    getUsersInCourse(courseId, getOptions.users.enrollmentType.teacher)
      .then(instructors =>
        instructors.map(instructor =>
          Object.assign({}, instructor, {
            courseId,
            courseCode,
            term: term.name
          })
        )
      )
  )
);
(async function () {
  const allSyllabi = await getAllCourseSyllabiInAccount(15)

  const courseIdsWithNoSyllabi = allSyllabi
    .filter(x => noSyllabus(x))

  const instructorsWithNoSyllabus = flatten(await getInstructors(courseIdsWithNoSyllabi))
  const nameAndCourse = instructorsWithNoSyllabus.map(({ name, courseCode, term }) => ([ name, courseCode, term ]))

  await writeHeader(path.join(__dirname, 'output/instructorsWithNoSyllabus/instructorsWithNoSyllabus.csv'), ['name', 'courseCode', 'term'])
  for (const instructor of nameAndCourse) {
    await append(path.join(__dirname, 'output/instructorsWithNoSyllabus/instructorsWithNoSyllabus.csv'), instructor)
  }
})()
