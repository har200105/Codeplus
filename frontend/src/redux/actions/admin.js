import { server } from '../store';
import { API } from '../../api';

export const createCourse = formData => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    };
    dispatch({ type: 'createCourseRequest' });

    const { data } = await API.post(`/createcourse`, formData, config);

    dispatch({ type: 'createCourseSuccess', payload: data.message });
  } catch (error) {
    dispatch({
      type: 'createCourseFail',
      payload: error.response.data.message,
    });
  }
};

export const deleteCourse = id => async dispatch => {
  try {
    const config = {};
    dispatch({ type: 'deleteCourseRequest' });

    const { data } = await API.delete(`/course/${id}`, config);

    dispatch({ type: 'deleteCourseSuccess', payload: data.message });
  } catch (error) {
    dispatch({
      type: 'deleteCourseFail',
      payload: error.response.data.message,
    });
  }
};

export const addLecture = (id, formdata) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    };
    dispatch({ type: 'addLectureRequest' });

    const { data } = await API.post(`/course/${id}`, formdata, config);

    dispatch({ type: 'addLectureSuccess', payload: data.message });
  } catch (error) {
    dispatch({
      type: 'addLectureFail',
      payload: error.response.data.message,
    });
  }
};

export const deleteLecture = (courseId, lectureId) => async dispatch => {
  try {
    const config = {};
    dispatch({ type: 'deleteLectureRequest' });

    const { data } = await API.delete(
      `/lecture?courseId=${courseId}&lectureId=${lectureId}`,
      config
    );

    dispatch({ type: 'deleteLectureSuccess', payload: data.message });
  } catch (error) {
    dispatch({
      type: 'deleteLectureFail',
      payload: error.response.data.message,
    });
  }
};

export const getAllUsers = () => async dispatch => {
  try {
    const config = {};
    dispatch({ type: 'getAllUsersRequest' });

    const { data } = await API.get(`/admin/users`, config);

    dispatch({ type: 'getAllUsersSuccess', payload: data.users });
  } catch (error) {
    dispatch({
      type: 'getAllUsersFail',
      payload: error.response.data.message,
    });
  }
};

export const updateUserRole = id => async dispatch => {
  try {
    const config = {};
    dispatch({ type: 'updateUserRoleRequest' });

    const { data } = await API.put(`/admin/user/${id}`, {}, config);

    dispatch({ type: 'updateUserRoleSuccess', payload: data.message });
  } catch (error) {
    dispatch({
      type: 'updateUserRoleFail',
      payload: error.response.data.message,
    });
  }
};

export const deleteUser = id => async dispatch => {
  try {
    const config = {};
    dispatch({ type: 'deleteUserRequest' });

    const { data } = await API.delete(`/admin/user/${id}`, config);

    dispatch({ type: 'deleteUserSuccess', payload: data.message });
  } catch (error) {
    dispatch({
      type: 'deleteUserFail',
      payload: error.response.data.message,
    });
  }
};

export const getDashboardStats = () => async dispatch => {
  try {
    dispatch({ type: 'getAdminStatsRequest' });

    const { data } = await API.get(`/admin/stats`);

    dispatch({ type: 'getAdminStatsSuccess', payload: data });
  } catch (error) {
    dispatch({
      type: 'getAdminStatsFail',
      payload: error.response.data.message,
    });
  }
};
