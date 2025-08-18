import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser, editUser, loadUser, clearSelectedUser } from "../store/usersSlice";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { AiOutlineInfoCircle } from "react-icons/ai";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  first_name: Yup.string()
    .required("First name is required")
    .max(50, "First name cannot be more than 50 characters")
    .matches(/^[a-zA-Z\s]*$/, "First name should not contain special characters or numbers"),
  last_name: Yup.string()
    .required("Last name is required")
    .max(50, "Last name cannot be more than 50 characters")
    .matches(/^[a-zA-Z\s]*$/, "Last name should not contain special characters or numbers"),
  avatar: Yup.string()
    .url("Invalid URL")
    .required("Profile Image Link is required"),
});

const UserFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const { selectedUser, loading, isProcessingAction } = useSelector(
    (state) => state.users
  );

  const [showFirstNameRules, setShowFirstNameRules] = useState(false);
  const [showLastNameRules, setShowLastNameRules] = useState(false);

  useEffect(() => {
    if (params.id) {
      dispatch(loadUser(params.id));
    } else {
      dispatch(clearSelectedUser());
    }
  }, [dispatch, params.id]);

  const initialValues = {
    email: "",
    first_name: "",
    last_name: "",
    avatar: "",
  };

  if (params.id && loading) {
    return <Loader />;
  }

  const formInitialValues = selectedUser ?
    {
      email: selectedUser.email || "",
      first_name: selectedUser.first_name || "",
      last_name: selectedUser.last_name || "",
      avatar: selectedUser.avatar || "",
    } : initialValues;

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (params.id) {
        await dispatch(editUser({ id: params.id, payload: values })).unwrap();
      } else {
        await dispatch(addUser(values)).unwrap();
      }
      navigate("/users");
    } catch (error) {
      console.error("Form submission failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md md:max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 py-8 ">
      {isProcessingAction && <Loader />}
      <div className="bg-white rounded-lg shadow-xl overflow-hidden dark:bg-gray-800">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 text-center relative py-2 dark:text-white">
            <span className="relative z-10">
              {params.id ? "Edit User" : "Create New User"}
            </span>
          </h2>
        </div>
        <div className="p-6">
          <Formik
            initialValues={formInitialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="flex flex-col gap-5 max-w-lg mx-auto">
                <div className="space-y-6">
                  {/* Email Field */}
                  <label className="flex flex-col text-gray-700 font-medium dark:text-gray-300">
                    <span>Email<span className="text-red-500 font-bold ml-1">*</span></span>
                    <Field
                      type="email"
                      name="email"
                      className="mt-1 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    {errors.email && touched.email && (
                      <div className="text-red-500 text-sm mt-1">{errors.email}</div>
                    )}
                  </label>

                  {/* First Name Field with Tooltip */}
                  <label className="flex flex-col text-gray-700 font-medium relative dark:text-gray-300">
                    <span className="flex items-center gap-1">
                      First Name<span className="text-red-500 font-bold ml-1">*</span>
                      <span
                        className="relative"
                        onMouseEnter={() => setShowFirstNameRules(true)}
                        onMouseLeave={() => setShowFirstNameRules(false)}
                      >
                        <AiOutlineInfoCircle size="18px" className="text-gray-400 dark:text-gray-500" />
                        {showFirstNameRules && (
                          <div className="absolute z-10 top-full left-0 mt-2 w-max p-2 rounded-md bg-gray-800 text-white text-sm shadow-lg dark:bg-gray-900">
                            <ul className="list-disc list-inside space-y-1">
                              <li>Max 50 characters</li>
                              <li>No special characters or numbers</li>
                            </ul>
                          </div>
                        )}
                      </span>
                    </span>
                    <Field
                      type="text"
                      name="first_name"
                      className="mt-1 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    {errors.first_name && touched.first_name && (
                      <div className="text-red-500 text-sm mt-1">{errors.first_name}</div>
                    )}
                  </label>

                  {/* Last Name Field with Tooltip */}
                  <label className="flex flex-col text-gray-700 font-medium relative dark:text-gray-300">
                    <span className="flex items-center gap-1">
                      Last Name<span className="text-red-500 font-bold ml-1">*</span>
                      <span
                        className="relative"
                        onMouseEnter={() => setShowLastNameRules(true)}
                        onMouseLeave={() => setShowLastNameRules(false)}
                      >
                        <AiOutlineInfoCircle size="18px" className="text-gray-400 dark:text-gray-500" />
                        {showLastNameRules && (
                          <div className="absolute z-10 top-full left-0 mt-2 w-max p-2 rounded-md bg-gray-800 text-white text-sm shadow-lg dark:bg-gray-900">
                            <ul className="list-disc list-inside space-y-1">
                              <li>Max 50 characters</li>
                              <li>No special characters or numbers</li>
                            </ul>
                          </div>
                        )}
                      </span>
                    </span>
                    <Field
                      type="text"
                      name="last_name"
                      className="mt-1 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    {errors.last_name && touched.last_name && (
                      <div className="text-red-500 text-sm mt-1">{errors.last_name}</div>
                    )}
                  </label>

                  {/* Avatar Field */}
                  <label className="flex flex-col text-gray-700 font-medium dark:text-gray-300">
                    <span>Profile Image Link<span className="text-red-500 font-bold ml-1">*</span></span>
                    <Field
                      type="url"
                      name="avatar"
                      className="mt-1 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    {errors.avatar && touched.avatar && (
                      <div className="text-red-500 text-sm mt-1">{errors.avatar}</div>
                    )}
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
                  <button
                    type="button"
                    className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-400 bg-white text-gray-700 hover:bg-gray-100 transition-colors duration-300 ease-in-out dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                    onClick={() => navigate("/users")}
                  >
                    Cancel
                  </button>
                  <button
                    className="w-full sm:w-auto px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 ease-in-out"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : (params.id ? "Update" : "Create")}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default UserFormPage;