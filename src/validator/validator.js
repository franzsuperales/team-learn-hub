import * as yup from "yup";

const userRegistrationSchema = yup.object().shape({
  fname: yup
    .string()
    .required("First name is required")
    .min(2, "Must be at least 2 characters")
    .max(20)
    .trim(),
  lname: yup
    .string()
    .required("Last name is required")
    .min(2, "Must be at least 2 characters")
    .max(20)
    .trim(),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email address")
    .trim()
    .matches(
      /^[a-z]+(?:[._][a-z]+)*@questronix\.com\.ph$/,
      "Only Questronix emails are allowed"
    ),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must not exceed 20 characters")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
      "Password must contain at least one letter and one number"
    )
    .trim(),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords must match")
    .trim(),
});

const userSigninSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email address")
    .trim(),
  password: yup.string().required("Password is required").trim(),
});

const validEmail = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email address")
    .trim()
    .matches(
      /^[a-z]+(?:[._][a-z]+)*@questronix\.com\.ph$/,
      "Only Questronix emails are allowed"
    ),
});

const validPassword = yup.object().shape({
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must not exceed 20 characters")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
      "Password must contain at least one letter and one number"
    )
    .trim(),

  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords must match")
    .trim(),
});

const newPassword = yup.object().shape({
  password: yup.string().required("Password is required").trim(),
  newPassword: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must not exceed 20 characters")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
      "Password must contain at least one letter and one number"
    )
    .trim(),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .trim(),
});

const profileSchema = yup.object().shape({
  fname: yup
    .string()
    .required("First name is required")
    .min(2, "Must be at least 2 characters")
    .max(20)
    .trim(),
  lname: yup
    .string()
    .required("Last name is required")
    .min(2, "Must be at least 2 characters")
    .max(20)
    .trim(),
  bio: yup.string().min(2, "Must be at least 2 characters").max(200).trim(),
});

export {
  userRegistrationSchema,
  userSigninSchema,
  validEmail,
  validPassword,
  profileSchema,
  newPassword,
};
