import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  FormLabel,
  Heading,
  Input,
  VStack,
  Select,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { register } from '../../redux/actions/user';

export const fileUploadCss = {
  cursor: 'pointer',
  marginLeft: '-5%',
  width: '110%',
  border: 'none',
  height: '100%',
  color: 'black',
  backgroundColor: 'white',
};

const fileUploadStyle = {
  '&::file-selector-button': fileUploadCss,
};

const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [imagePrev, setImagePrev] = useState('');
  const [image, setImage] = useState('');
  const [isFaculty, setIsFaculty] = useState(false);
  const [department, setDepartment] = useState('');

  const Departments = [
    'Computer Science & Engineering',
    'Mechanical Engineering',
    'Electrical Engineering',
    'Chemical Engineering',
    'Civil Engineering',
  ];

  const dispatch = useDispatch();
  const changeImageHandler = e => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setImagePrev(reader.result);
      setImage(file);
    };
  };

  const submitHandler = e => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.append('name', name);
    myForm.append('email', email.toLowerCase());
    myForm.append('password', password);
    myForm.append('file', image);
    myForm.append('isFaculty', isFaculty);
    myForm.append('department', department);
    dispatch(register(myForm));
  };

  return (
    <Container h={'95vh'}>
      <VStack h={'full'} justifyContent="center" spacing={'16'}>
        <Heading textTransform={'uppercase'} children={'Registration'} />
        <form
          onSubmit={submitHandler}
          style={{
            width: '100%',
            backgroundColor: 'gray',
            paddingLeft: '20px',
            paddingRight: '20px',
            borderRadius: '10px',
          }}
        >
          <Box my="4" display={'flex'} justifyContent="center">
            <Avatar src={imagePrev} size={'2xl'} />
          </Box>
          <Box my={'4'}>
            <FormLabel htmlFor="name" children="Name" />
            <Input
              required
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="abc"
              type={'text'}
              focusBorderColor="blue.500"
            />
          </Box>

          <Box my={'4'}>
            <FormLabel htmlFor="email" children="Email Address" />
            <Input
              required
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="abc@gmail.com"
              type={'email'}
              focusBorderColor="blue.500"
            />
          </Box>

          <Box my={'4'}>
            <FormLabel htmlFor="password" children="Password" />
            <Input
              required
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter Your Password"
              type={'password'}
              focusBorderColor="blue.500"
            />
          </Box>
          <Box>
            <FormLabel htmlFor="department" children="Department" />
            <Select
              focusBorderColor="purple.300"
              value={department}
              onChange={e => setDepartment(e.target.value)}
            >
              <option value="">Choose Your Department</option>

              {Departments.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </Box>

          <Box my="4">
            <FormLabel htmlFor="isFaculty" children="Is Faculty" />
            <Checkbox
              id="isFaculty"
              onChange={e => setIsFaculty(e.target.checked)}
            />
          </Box>

          <Box my={'4'}>
            <FormLabel htmlFor="chooseAvatar" children="Choose Avatar" />
            <Input
              accept="image/*"
              id="chooseAvatar"
              type={'file'}
              css={fileUploadStyle}
              onChange={changeImageHandler}
            />
          </Box>

          <Button my="4" colorScheme={'blue'} type="submit" color="white">
            Sign Up
          </Button>

          <Box my="4">
            Already Signed Up? &nbsp;
            <Link to="/login">
              <Button colorScheme={'blue'} variant="link">
                Login here
              </Button>
            </Link>
          </Box>
        </form>
      </VStack>
    </Container>
  );
};

export default Register;
