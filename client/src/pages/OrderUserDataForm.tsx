import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Input must contain at least 1 character')
    .max(40, 'The maximum length of 40 characters has been exceeded')
    .transform((val) => val[0].toUpperCase() + val.slice(1)),
  surname: z
    .string()
    .trim()
    .min(1, 'Input must contain at least 1 character')
    .max(40, 'The maximum length of 40 characters has been exceeded')
    .transform((val) => val[0].toUpperCase() + val.slice(1)),
  address: z
    .string()
    .trim()
    .min(1, 'Input must contain at least 1 character')
    .max(40, 'The maximum length of 40 characters has been exceeded')
    .transform((val) => val[0].toUpperCase() + val.slice(1)),
  zipCode: z
    .string()
    .trim()
    .regex(/^\d{2}-\d{3}$/, 'Zip code must be in the format xx-xxx.'),
  cityTown: z
    .string()
    .trim()
    .min(1, 'Input must contain at least 1 character')
    .max(40, 'The maximum length of 40 characters has been exceeded')
    .transform((val) => val[0].toUpperCase() + val.slice(1)),
  phone: z.string().trim().length(9, 'Phone number must contain 9 numbers'),
  email: z
    .string()
    .trim()
    .email('Wrong email format')
    .toLowerCase()
    .max(40, 'The maximum length of 40 characters has been exceeded'),
});

export default function OrderUserDataForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  return (
    <main className="mt-10 flex items-center justify-center">
      <form
        onSubmit={handleSubmit((values) => {
          navigate('/summary', { state: values });
        })}
        className="flex w-[80vw] flex-col gap-4 rounded-lg border border-gray-400 bg-white p-2 shadow"
      >
        <h1 className="text-2xl font-bold">Delivery address</h1>

        <input
          {...register('name')}
          autoComplete="given-name"
          placeholder="Name"
          className="rounded-lg border border-gray-400 p-2"
        />
        {errors.name?.message && (
          <p className="text-red-600">{errors.name?.message.toString()}</p>
        )}
        <input
          {...register('surname')}
          autoComplete="family-name"
          placeholder="Surname"
          className="rounded-lg border border-gray-400 p-2"
        />
        {errors.surname?.message && (
          <p className="text-red-600">{errors.surname?.message.toString()}</p>
        )}
        <input
          {...register('address')}
          autoComplete="street-address"
          placeholder="Addres"
          className="rounded-lg border border-gray-400 p-2"
        />
        {errors.addres?.message && (
          <p className="text-red-600">{errors.addres?.message.toString()}</p>
        )}
        <input
          {...register('zipCode')}
          autoCapitalize="postal-code"
          placeholder="Zip Code"
          className="rounded-lg border border-gray-400 p-2"
        />
        {errors.zipCode?.message && (
          <p className="text-red-600">{errors.zipCode?.message.toString()}</p>
        )}
        <input
          {...register('cityTown')}
          autoComplete="address-level2"
          placeholder="City/Town"
          className="rounded-lg border border-gray-400 p-2"
        />
        {errors.cityTown?.message && (
          <p className="text-red-600">{errors.cityTown?.message.toString()}</p>
        )}
        <input
          {...register('phone')}
          autoComplete="tel-local"
          placeholder="Phone Number"
          className="rounded-lg border border-gray-400 p-2"
        />
        {errors.phone?.message && (
          <p className="text-red-600">{errors.phone?.message.toString()}</p>
        )}
        <input
          {...register('email')}
          autoComplete="email"
          placeholder="Email"
          className="rounded-lg border border-gray-400 p-2"
        />
        {errors.email?.message && (
          <p className="text-red-600">{errors.email?.message.toString()}</p>
        )}

        <button className="flex items-center justify-center rounded-lg bg-green-500 p-2 font-bold text-white transition hover:bg-green-300">
          Submit
        </button>
      </form>
    </main>
  );
}
