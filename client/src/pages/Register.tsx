import { zodResolver } from '@hookform/resolvers/zod';
import { FirebaseError } from 'firebase/app';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { auth } from '../API/Firebase';
import useShowNotification from '../hooks/useShowNotification';
import { FirebaseErrorCodes } from '../types/FirebaseAuthTypes';

const formSchema = z
  .object({
    email: z
      .string()
      .email('Invalid email format')
      .max(40, 'The maximum length of 40 characters has been exceeded'),
    password: z
      .string()
      .min(8, 'The password must contain at least 8 characters')
      .max(40, 'The maximum length of 40 characters has been exceeded')
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        'The password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'The passwords do not match',
    path: ['confirmPassword'],
  });

function Register() {
  const [firebaseStatus, setFirebaseStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { showNotification } = useShowNotification();

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    reValidateMode: 'onSubmit',
  });

  useEffect(() => {
    setFocus('email');
  }, [setFocus]);

  async function handleRegistrationSubmit(data: FieldValues) {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const trimmedEmail = data.email.trim();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        trimmedEmail,
        data.password,
      );
      reset();
      if (userCredential.user) {
        localStorage.setItem('cartItems', '');
        showNotification('Successfully registered', {
          backgroundColor: 'green',
          textColor: '#ffffff',
          duration: 3000,
        });
        navigate('/');
      } else {
        setFirebaseStatus('User not found. Please try again.');
      }
    } catch (error) {
      const err = error as FirebaseError;
      if (err.code) {
        console.error(err.message);
        setFirebaseStatus(
          err.code === FirebaseErrorCodes.AlreadyInUse
            ? 'The email is already in use. Try another one.'
            : 'An unexpected error occurred. Please try again.',
        );
      } else {
        console.error(err);
        setFirebaseStatus('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center pt-14">
      <form
        onSubmit={handleSubmit(handleRegistrationSubmit)}
        noValidate
        className="flex w-[90%] flex-col gap-5 rounded-lg border-2 border-gray-300 p-5 shadow sm:w-[30rem]"
      >
        <h1 className="text-2xl font-bold">Sign Up</h1>
        <input
          autoComplete="email"
          placeholder="e-mail"
          type="email"
          {...register('email')}
          className="rounded-lg border border-black p-2"
        />
        {errors.email && <p>{errors.email.message?.toString()}</p>}
        <input
          autoComplete="current-password"
          placeholder="password"
          type="password"
          {...register('password')}
          className="rounded-lg border border-black p-2"
        />
        {errors.password && <p>{errors.password.message?.toString()}</p>}
        <input
          autoComplete="new-password"
          placeholder="confirm password"
          type="password"
          {...register('confirmPassword')}
          className="rounded-lg border border-black p-2"
        />
        {errors.confirmPassword && (
          <p className="text-red-600">
            {errors.confirmPassword.message?.toString()}
          </p>
        )}
        <p>
          The password must contain at least 8 characters, one uppercase letter,
          one lowercase letter, one number, and one special character.
        </p>
        <button
          onClick={() => setFirebaseStatus(null)}
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-green-500 p-1 font-bold text-white transition-transform hover:scale-105"
        >
          Sign Up
        </button>
        <h3 className="text-red-600">{firebaseStatus}</h3>
      </form>
    </div>
  );
}

export default Register;
