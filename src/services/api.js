import axios from "axios";

const API_URL = "/api/students";

// Get all students
export const getStudents = () => {
  return axios.get(API_URL);
};

// Add student
export const addStudent = (student) => {
  return axios.post(API_URL, student);
};