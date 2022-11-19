import React, { useEffect } from 'react';
import { Button, Container, VStack, Box } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { verifyEmail } from '../../redux/actions/user';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
  const { error, message } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: 'clearError' });
    }
    if (message) {
      toast.success(message);
      dispatch({ type: 'clearMessage' });
    }
  }, [dispatch, error, message]);

  return (
    <>
      <Container h={'95vh'}>
        <VStack h={'full'} justifyContent="center" spacing={'16'}>
          <Box my="4">
            <Button
              onClick={() => dispatch(verifyEmail(token))}
              colorScheme="blue"
              color="white"
            >
              Verify Email
            </Button>
          </Box>
        </VStack>
      </Container>
    </>
  );
};

export default VerifyEmail;
