import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { loginAdmin } from '../utils/auth';

const schema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = async (values) => {
    setServerError('');
    const result = loginAdmin(values.username, values.password);
    if (!result.ok) {
      setServerError(result.error);
      return;
    }

    const target = location.state?.from || '/admin';
    navigate(target, { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg premium-mesh p-4">
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-glow"
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-10 w-10 place-content-center rounded-xl bg-brand-red/20 text-brand-red">
            <ShieldCheck size={18} />
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold">Admin Access</h1>
            <p className="text-sm text-zinc-400">Secure panel for content control</p>
          </div>
        </div>

        <label className="mb-2 block text-sm text-zinc-300">Admin User</label>
        <input
          {...register('username')}
          className="mb-2 w-full rounded-xl border border-zinc-700 bg-black/40 px-3 py-2.5 outline-none ring-brand-red/40 focus:ring"
          placeholder="Admin user"
        />
        {errors.username && <p className="mb-3 text-xs text-red-400">{errors.username.message}</p>}

        <label className="mb-2 block text-sm text-zinc-300">Admin Password</label>
        <input
          type="password"
          {...register('password')}
          className="mb-2 w-full rounded-xl border border-zinc-700 bg-black/40 px-3 py-2.5 outline-none ring-brand-red/40 focus:ring"
          placeholder="Admin password"
        />
        {errors.password && <p className="mb-3 text-xs text-red-400">{errors.password.message}</p>}

        {serverError && <p className="mb-3 text-sm text-red-400">{serverError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full rounded-xl bg-brand-red px-4 py-2.5 font-semibold text-white hover:brightness-110 disabled:opacity-60"
        >
          {isSubmitting ? 'Checking...' : 'Enter dashboard'}
        </button>
      </motion.form>
    </div>
  );
}
