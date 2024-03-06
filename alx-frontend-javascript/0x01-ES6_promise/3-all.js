import { uploadPhoto, createUser } from '.utilis';

export default function handleProfileSignup() {
  return Promise.all([uploadPhoto(), createUser()])
    .then((value) => {
      console.log('${value[0].body ${value[1].firstName} ${value[1].lastName]');
    }

    .catch(() => console.log('Signup system offline'));
}
