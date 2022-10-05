import { Button, VStack } from '@chakra-ui/react';
import React from 'react';
import {
  RiAddCircleFill,
  RiDashboardFill,
  RiEyeFill,
  RiUser3Fill,
} from 'react-icons/ri';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const { courses } = useSelector(state => state.course);
  return (
    <VStack spacing={'8'} p="16">
      <LinkButton
        Icon={RiDashboardFill}
        text="Dashboard"
        url={'dashboard'}
        active={location.pathname === '/admin/dashboard'}
      />
      <LinkButton
        Icon={RiAddCircleFill}
        text="Create Course"
        url={'createcourse'}
        active={location.pathname === '/admin/createcourse'}
      />
      <LinkButton
        Icon={RiEyeFill}
        text="Courses"
        url={'courses'}
        active={location.pathname === '/admin/courses'}
      />
      <b
        style={{
          textAlign: 'center',
          fontWeight: 'bold',
        }}
      >
        Total Revenue - ₹{' '}
        {parseFloat(
          courses?.reduce((initialSum, a) => initialSum + a.views, 0)
        ) * 0.001}
      </b>
    </VStack>
  );
};

export default Sidebar;

function LinkButton({ url, Icon, text, active }) {
  return (
    <Link to={`/admin/${url}`}>
      <Button
        fontSize={'larger'}
        variant="ghost"
        colorScheme={active ? 'purple' : ''}
      >
        <Icon style={{ margin: '4px' }} />
        {text}
      </Button>
    </Link>
  );
}
