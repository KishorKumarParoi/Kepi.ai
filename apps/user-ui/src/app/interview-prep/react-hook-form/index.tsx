"use client"

import React, { useActionState, useEffect, useMemo, useOptimistic } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const userProfileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email'),
  country: z.enum(['US', 'UK', 'CA']),
  phoneCode: z.string(),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree'),
  bio: z.string().max(500, 'Bio too long').optional(),
  skills: z.array(z.string()).min(1, 'Select at least one skill'),
});

type UserProfileData = z.infer<typeof userProfileSchema>;

async function submitUserProfile(data: UserProfileData) {

  // Simulate server processing
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log('Server received:', data);

  return {
    success: true,
    message: 'Profile updated successfully',
    data: data
  }
}

export function ComprehensiveExample() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting, isDirty, isValid },
    reset
  } = useForm<UserProfileData>({
    mode: 'onChange', // Real-time validation
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      country: 'US',
      phoneCode: '+1',
      skills: [],
      agreeToTerms: false
    }
  });

  const { state, formAction, isPending } = useActionState(
    async (prevState: any, formData: UserProfileData) => {
      const result = await submitUserProfile(formData)
      if (result.success) {
        reset()
      }
      return result
    },
    {
      success: false, message: '', data: null
    }
  )

  const [optimisticData, setOptimisticData] = useOptimistic(
    state.data,
    (currentState, optimisticValue: UserProfileData) => optimisticValue
  )

  // 1. WATCH - Monitor country changes
  const selectedCountry = watch('country');
  const bio = watch('bio');

  // 2. SETVALUE - Auto-update phone code based on country
  useEffect(() => {
    const phoneCodes = {
      US: '+1',
      UK: '+44',
      CA: '+1'
    };
    setValue('phoneCode', phoneCodes[selectedCountry], {
      shouldValidate: true,
      shouldDirty: true
    });
  }, [selectedCountry, setValue]);

  // Calculate bio character count (using watch)
  const bioCharCount = useMemo(() => bio?.length || 0, [bio]);
  const bioRemainingChars = 500 - bioCharCount;

  // 3. Load data from API (using setValue)
  useEffect(() => {
    async function loadUserProfile() {
      // Simulate API call
      const userData = {
        username: 'johndoe',
        email: 'john@example.com',
        bio: 'Software developer'
      };

      setValue('username', userData.username);
      setValue('email', userData.email);
      setValue('bio', userData.bio);
    }

    // Uncomment to test
    loadUserProfile();
  }, [setValue]);

  const onSubmit = async (data: UserProfileData) => {
    // await new Promise(resolve => setTimeout(resolve, 2000));
    setOptimisticData(data);
    // console.log('Submitted:', data);
    await formAction(data);
    // reset();
  };

  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='space-y-8 max-w-2xl mx-auto p-8'>
        <div className='bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg'>
          <h2 className='text-3xl font-bold mb-2'>React 19 + Next.js 15 Form</h2>
          <p className='text-sm opacity-90'>
            Featuring: useActionState, useOptimistic, Server Actions, and React Hook Form
          </p>
        </div>

        {/* ============================================ */}
        {/* 🆕 Status Messages (useActionState result) */}
        {/* ============================================ */}


        {state.message && (
          <div className={`p-4 rounded-lg ${state.success
            ? 'bg-green-100 border border-green-400 text-green-700'
            : 'bg-red-100 border border-red-400 text-red-700'
            }`}>
            <p className='font-medium'>{state.message}</p>
            {state.success && optimisticData && (
              <div className='mt-2 text-sm'>
                <p>✓ Username: {optimisticData.username}</p>
                <p>✓ Email: {optimisticData.email}</p>
                <p>✓ Skills: {optimisticData.skills.join(', ')}</p>
              </div>
            )}
          </div>
        )}


        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 max-w-2xl mx-auto p-8'>
          <h2 className='text-2xl font-bold mb-6'>Comprehensive Form Example</h2>

          {/* Username */}
          <div>
            <label className='block text-sm font-medium mb-2'>Username</label>
            <input
              {...register('username')}
              className='w-full border border-gray-300 p-2 rounded'
              placeholder='Enter username'
            />
            {errors.username && (
              <p className='text-red-500 text-sm mt-1'>{errors.username.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className='block text-sm font-medium mb-2'>Email</label>
            <input
              {...register('email')}
              type='email'
              className='w-full border border-gray-300 p-2 rounded'
              placeholder='Enter email'
            />
            {errors.email && (
              <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>
            )}
          </div>

          {/* Country (triggers phone code update via watch & setValue) */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium mb-2'>Country</label>
              <select
                {...register('country')}
                className='w-full border border-gray-300 p-2 rounded'
              >
                <option value='US'>United States</option>
                <option value='UK'>United Kingdom</option>
                <option value='CA'>Canada</option>
              </select>
            </div>

            {/* Phone Code (auto-updated) */}
            <div>
              <label className='block text-sm font-medium mb-2'>Phone Code</label>
              <input
                {...register('phoneCode')}
                readOnly
                className='w-full border border-gray-300 p-2 rounded bg-gray-100'
              />
            </div>
          </div>

          {/* Bio with character counter (using watch) */}
          <div>
            <label className='block text-sm font-medium mb-2'>
              Bio
              <span className={`ml-2 text-xs ${bioRemainingChars < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                ({bioRemainingChars} characters remaining)
              </span>
            </label>
            <textarea
              {...register('bio')}
              rows={4}
              className='w-full border border-gray-300 p-2 rounded'
              placeholder='Tell us about yourself...'
            />
            {errors.bio && (
              <p className='text-red-500 text-sm mt-1'>{errors.bio.message}</p>
            )}
          </div>

          {/* Skills (using Controller for custom component) */}
          <div>
            <label className='block text-sm font-medium mb-2'>Skills</label>
            <Controller
              name='skills'
              control={control}
              render={({ field }) => (
                <div className='space-y-2'>
                  {['React', 'TypeScript', 'Node.js', 'Python', 'GraphQL'].map(skill => (
                    <label key={skill} className='flex items-center gap-2'>
                      <input
                        type='checkbox'
                        checked={field.value.includes(skill)}
                        onChange={(e) => {
                          const updatedSkills = e.target.checked
                            ? [...field.value, skill]
                            : field.value.filter(s => s !== skill);
                          field.onChange(updatedSkills);
                        }}
                      />
                      <span className='text-sm'>{skill}</span>
                    </label>
                  ))}
                </div>
              )}
            />
            {errors.skills && (
              <p className='text-red-500 text-sm mt-1'>{errors.skills.message}</p>
            )}
          </div>

          {/* Terms */}
          <div>
            <label className='flex items-center gap-2'>
              <input type='checkbox' {...register('agreeToTerms')} />
              <span className='text-sm'>I agree to terms and conditions</span>
            </label>
            {errors.agreeToTerms && (
              <p className='text-red-500 text-sm mt-1'>{errors.agreeToTerms.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className='flex gap-4'>
            <button
              type='submit'
              disabled={isSubmitting || !isDirty || !isValid}
              className={`px-6 py-2 rounded text-white font-medium ${isSubmitting || !isDirty || !isValid
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>

            <button
              type='button'
              onClick={() => reset()}
              className='px-6 py-2 rounded bg-gray-500 text-white hover:bg-gray-600 font-medium'
            >
              Reset
            </button>

            <button
              type='button'
              onClick={() => {
                setValue('username', 'demo_user');
                setValue('email', 'demo@example.com');
                setValue('bio', 'This is a demo profile');
                setValue('skills', ['React', 'TypeScript']);
              }}
              className='px-6 py-2 rounded bg-green-600 text-white hover:bg-green-700 font-medium'
            >
              Auto-fill Demo Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
