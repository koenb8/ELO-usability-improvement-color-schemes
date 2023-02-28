import { HomeRepository } from "~src/repository/homeRepository";

export function redirectCourseWidget() {
  HomeRepository.getInstance()
    .getCourses()
    .then((courses) => {
      for (let i = 0; i < courses.length; i++) {
        updateUrl(courses[i]);
      }
    });
}

function updateUrl(course: Element) {
  HomeRepository.getInstance()
    .getCourseUrlFromCourse(course)
    .then((url) => {
      let tries = 0;
      const interval = setInterval(() => {
        tries++;

        const courseId = url.getAttribute("href")?.replace("/d2l/home/", "");

        if (courseId) {
          clearInterval(interval);
          url.setAttribute("href", `/d2l/le/content/${courseId}/Home`);
        }
        if (tries > 1000) {
          clearInterval(interval);
        }
      }, 10);
    });
}
