import { API } from '../../api';

export const getAllCourses = (category = '', keyword = '') => async (dispatch) => {
    try {
      dispatch({ type: 'allCoursesRequest' });

      const { data } = await API.get(
        `/courses?keyword=${keyword}&category=${category}`
      );

      dispatch({ type: 'allCoursesSuccess', payload: data.courses });
    } catch (error) {
      dispatch({
        type: 'allCoursesFail',
        payload: error.response.data.message,
      });
    }
  };

export const getAllAdminCourses = () => async (dispatch) => {
  try {
    dispatch({ type: 'adminCoursesRequest' });

    const { data } = await API.get(`/getAdminCourses`);

    dispatch({ type: 'adminCoursesSuccess', payload: data.courses });
  } catch (error) {
    dispatch({
      type: 'adminCoursesFail',
      payload: error.response.data.message,
    });
  }
};

export const getCourseLectures = id => async (dispatch) => {
  try {
    dispatch({ type: 'getCourseRequest' });

    const { data } = await API.get(`/course/${id}`, {});

    dispatch({ type: 'getCourseSuccess', payload: data.lectures });
  } catch (error) {
    dispatch({
      type: 'getCourseFail',
      payload: error.response.data.message,
    });
  }
};
