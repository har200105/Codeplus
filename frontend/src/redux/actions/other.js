import { API } from '../../api';


export const courseRequest = (name, email, course) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    };

    dispatch({ type: 'courseRequestRequest' });

    const { data } = await API.post(
      `/courserequest`,
      { name, email, course },
      config
    );

    dispatch({ type: 'courseRequestSuccess', payload: data.message });
  } catch (error) {
    dispatch({
      type: 'courseRequestFail',
      payload: error.response.data.message,
    });
  }
};
