import React from 'react';
import { Button, Heading, Stack, Text, VStack } from '@chakra-ui/react';
import './home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <section className="home">
      <div className="container">
        <Stack
          direction={['column', 'row']}
          height="100%"
          justifyContent={['center', 'space-between']}
          alignItems="center"
          spacing={['16', '56']}
        >
          <VStack width={'full'} alignItems={['center']} spacing="8">
            <Heading children="NOW LEARN THE BEST" size={'2xl'} />
            <Text
              fontSize={'2xl'}
              fontFamily="cursive"
              textAlign={['center', 'left']}
              children="Best Courses at one Go"
            />
            <Link to="/courses">
              <Button size={'lg'} colorScheme="yellow">
                <span className="text">View Courses</span>
              </Button>
            </Link>
          </VStack>
        </Stack>
      </div>
    </section>
  );
};

export default Home;
