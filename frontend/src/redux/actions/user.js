import { API } from '../../api';

export const login = (email, password) => async dispatch => {
  try {
    dispatch({ type: 'loginRequest' });

    const { data } = await API.post(
      `/login`,
      { email, password },
      {
        headers: {
          'Content-type': 'application/json',
        },
      }
    );

    localStorage.setItem('token', data.token);
    dispatch({ type: 'loginSuccess', payload: data });
  } catch (error) {
    dispatch({ type: 'loginFail', payload: error.response.data.message });
  }
};

export const register = formdata => async dispatch => {
  try {
    dispatch({ type: 'registerRequest' });

    const { data } = await API.post(`/register`, formdata, {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    });

    dispatch({ type: 'registerSuccess', payload: data });
  } catch (error) {
    dispatch({ type: 'registerFail', payload: error.response.data.message });
  }
};

export const verifyEmail = token => async dispatch => {
  try {
    dispatch({ type: 'verifyEmailRequest' });

    const { data } = await API.post(
      `/verifyEmail`,
      { token },
      {
        headers: {
          'Content-type': 'application/json',
        },
      }
    );

    dispatch({ type: 'verifyEmailSuccess', payload: data });
  } catch (error) {
    dispatch({ type: 'verifyEmailFail', payload: error.response.data.message });
  }
};

export const addFaculty = formdata => async dispatch => {
  try {
    dispatch({ type: 'addFacultyRequest' });

    const { data } = await API.post(`/addFaculty`, formdata, {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    });

    dispatch({ type: 'addFacultySuccess', payload: data });
  } catch (error) {
    dispatch({
      type: 'addFacultyFail',
      payload: error.response.data.message,
    });
  }
};

export const loadUser = () => async dispatch => {
  try {
    dispatch({ type: 'loadUserRequest' });
    const { data } = await API.get(`/me`, {});
    dispatch({ type: 'loadUserSuccess', payload: data.user });
  } catch (error) {
    dispatch({ type: 'loadUserFail', payload: error.response.data.message });
  }
};

export const logout = () => async dispatch => {
  try {
    dispatch({ type: 'logoutRequest' });

    const { data } = await API.get(`/logout`);
    localStorage.removeItem('token');
    dispatch({ type: 'logoutSuccess', payload: data.message });
  } catch (error) {
    dispatch({ type: 'logoutFail', payload: error.response.data.message });
  }
};

export const buySubscription = () => async dispatch => {
  try {
    dispatch({ type: 'buySubscriptionRequest' });

    const { data } = await API.get(`/subscribe`, {});

    dispatch({ type: 'buySubscriptionSuccess', payload: data.subscriptionId });
  } catch (error) {
    dispatch({
      type: 'buySubscriptionFail',
      payload: error.response.data.message,
    });
  }
};

export const cancelSubscription = () => async dispatch => {
  try {
    dispatch({ type: 'cancelSubscriptionRequest' });

    const { data } = await API.delete(`/subscribe/cancel`, {});

    dispatch({ type: 'cancelSubscriptionSuccess', payload: data.message });
  } catch (error) {
    dispatch({
      type: 'cancelSubscriptionFail',
      payload: error.response.data.message,
    });
  }
};
