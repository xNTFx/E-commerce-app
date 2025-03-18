import { zodResolver } from '@hookform/resolvers/zod';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { auth } from '../API/Firebase';
import useShowNotification from '../hooks/useShowNotification';
import { FirebaseError, FirebaseErrorCodes } from '../types/FirebaseAuthTypes';

const formSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .max(40, 'The maximum length of 40 characters has been exceeded'),
  password: z
    .string()
    .min(8, 'The password must contain at least 8 characters')
    .max(40, 'The maximum length of 40 characters has been exceeded'),
});

function Login() {
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

  const handleFirebaseError = (error: FirebaseError) => {
    switch (error.code) {
      case FirebaseErrorCodes.UserNotFound:
        setFirebaseStatus('The email does not exist.');
        break;
      case FirebaseErrorCodes.WrongPassword:
        setFirebaseStatus('Wrong password.');
        break;
      case FirebaseErrorCodes.TooManyRequests:
        setFirebaseStatus('Too many requests. Please try again later.');
        break;
      case FirebaseErrorCodes.InvalidCredential:
        setFirebaseStatus('Invalid login or password. Please try again later');
        break;
      default:
        console.error(error);
        setFirebaseStatus('An unexpected error occurred. Please try again.');
    }
  };

  async function handleLoginSubmit(data: FieldValues) {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const trimmedEmail = data.email.trim();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        trimmedEmail,
        data.password,
      );
      reset();
      if (userCredential.user) {
        showNotification('Successfully logged in', {
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
        handleFirebaseError(err);
      } else {
        console.error(err);
        setFirebaseStatus('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex pt-14 flex-col items-center justify-center">
      <form
        onSubmit={handleSubmit(handleLoginSubmit)}
        noValidate
        className="flex w-[90%] flex-col gap-5 rounded-lg border-2 border-gray-300 p-5 shadow sm:w-[30rem]"
      >
        <h1 className="text-2xl font-bold">Sign in</h1>
        <input
          autoComplete="email"
          placeholder="e-mail"
          {...register('email')}
          type="email"
          className="rounded-lg border border-black p-2"
        />
        {errors.email && (
          <p className="text-red-600">{errors.email.message?.toString()}</p>
        )}
        <input
          autoComplete="current-password"
          placeholder="password"
          {...register('password')}
          type="password"
          className="rounded-lg border border-black p-2"
        />
        {errors.password && (
          <p className="text-red-600">{errors.password.message?.toString()}</p>
        )}
        <div>
          <button
            onClick={() => setFirebaseStatus(null)}
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-green-500 p-1 font-bold text-white transition-transform hover:scale-105"
          >
            Sign in
          </button>
        </div>
        <p className="text-red-600">{firebaseStatus}</p>
      </form>
    </main>
  );
}

export default Login;
