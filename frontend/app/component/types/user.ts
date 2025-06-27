export interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  levelOfEducation: string;
  university: string;
  cgpa: string;
  interests: string;
  careerGoals: string;
  currentRole: string;
  company: string;
  dailyRoutine: string;
  currentProjects: string;
  learningGoals: string;
  challenges: string;
  achievements: string;
  notes: string;
  favoriteProgrammingLanguages: string;
}

export const initialUserInfo: UserInfo = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '123-456-7890',
  dob: '1998-05-15',
  levelOfEducation: 'Bachelor\'s Degree',
  university: 'State University of Technology',
  cgpa: '3.75',
  interests: 'Cloud Computing, DevOps, Cybersecurity, AI Ethics',
  careerGoals: 'Become a Solutions Architect, Lead Tech Start-up',
  currentRole: 'Software Engineer I',
  company: 'Tech Solutions Co.',
  dailyRoutine: 'Morning stand-up, coding for features, unit testing, occasional meetings with product team.',
  currentProjects: 'Developing microservices for user authentication, optimizing API gateway performance.',
  learningGoals: 'Learning Kubernetes, becoming proficient in Go, understanding advanced system design patterns.',
  challenges: 'Integrating legacy systems, keeping up with rapid technological changes.',
  achievements: 'Successfully migrated critical service to new infrastructure, reduced bug reports by 20%.',
  notes: 'Enjoying the current work, looking for mentorship opportunities in system architecture.',
  favoriteProgrammingLanguages: 'Python, Java, JavaScript',
};