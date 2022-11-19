import {
  Box,
  Button,
  Container,
  FormLabel,
  Heading,
  Input,
  VStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { login } from '../../redux/actions/user';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const submitHandler = e => {
    e.preventDefault();
    dispatch(login(email.toLowerCase(), password));
  };

  return (
    <Container h={'95vh'}>
      <VStack h={'full'} justifyContent="center" spacing={'16'}>
        <Heading children={'Welcome to Codeplus'} />

        <form onSubmit={submitHandler} style={{ width: '100%' }}>
          <Box my={'4'}>
            <FormLabel htmlFor="email" children="Email Address" />
            <Input
              required
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="abc@gmail.com"
              type={'email'}
              focusBorderColor="yellow.500"
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
              focusBorderColor="yellow.500"
            />
          </Box>

          <Box>
            <Link to="/forgetpassword">
              <Button fontSize={'sm'} variant="link">
                Forget Password?
              </Button>
            </Link>
          </Box>

          <Button my="4" colorScheme="blue" type="submit" color="white">
            Login
          </Button>

          <Box my="4">
            New User? &nbsp;
            <Link to="/register">
              <Button colorScheme="blue" variant="link">
                Signup here
              </Button>
            </Link>
          </Box>
        </form>
      </VStack>
    </Container>
  );
};

export default Login;
