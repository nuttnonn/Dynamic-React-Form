// import { FC } from "react";
// import { z } from "zod";
// import { useForm, SubmitHandler, Controller } from 'react-hook-form'
// import { zodResolver } from "@hookform/resolvers/zod";
//
// const NoSchema = z.object({
//     name: z.string(),
//     address: z.string(),
//     sendType: z.literal('no'),
// });
//
// const EmailSchema = z.object({
//     name: z.string(),
//     address: z.string(),
//     sendType: z.literal('email'),
//     email: z.string().email(),
// });
//
// const PhoneNumberSchema = z.object({
//     name: z.string(),
//     address: z.string(),
//     sendType: z.literal('phone'),
//     phoneNumber: z.string(),
// });
//
// const FormSchema = z.union([
//     NoSchema,
//     EmailSchema,
//     PhoneNumberSchema,
// ]);
//
// type FormSchemaType = z.infer<typeof FormSchema>;
//
// const App: FC = () => {
//     const { register, watch, handleSubmit, control } = useForm<FormSchemaType>({
//         resolver: zodResolver(FormSchema),
//     });
//
//     const sendType = watch("sendType");
//
//     const onSubmit: SubmitHandler<FormSchemaType> = (data) => {
//         console.log(data);
//     };
//
//     return (
//         <div className="bg-gray-100 min-h-screen">
//             <div className="max-w-xl w-full mx-auto px-4 py-32">
//                 <form
//                     className="bg-white rounded-lg px-8 py-12 shadow-lg"
//                     onSubmit={handleSubmit(onSubmit)}
//                 >
//                     <h1 className="text-orange-600 text-xl font-semibold mb-8">
//                         Order Package
//                     </h1>
//                     <label className="block">
//                         <span className="block mb-1 text-gray-600">Your name</span>
//                         <input
//                             className="w-full rounded-lg border-gray-300 focus:ring-0 focus:border-orange-600 py-3"
//                             type="text"
//                             {...register("name")}
//                         />
//                     </label>
//                     <label className="block">
//                         <span className="block mb-1 text-gray-600">Your address</span>
//                         <input
//                             className="w-full rounded-lg border-gray-300 focus:ring-0 focus:border-orange-600 py-3"
//                             type="text"
//                             {...register("address")}
//                         />
//                     </label>
//                     <Controller
//                         name="sendType"
//                         control={control}
//                         render={({ field: { onChange, value } }) => (
//                             <>
//                                 <input
//                                     type="radio"
//                                     value="no"
//                                     onChange={(e) => onChange(e.target.value)}
//                                     checked={value === 'no'}
//                                     className="text-orange-600 w-5 h-5 border-gray-300 focus:ring-0 focus:ring-offset-0"
//                                 />
//                                 <span className="ml-2 text-gray-600">No</span>
//                                 <input
//                                     type="radio"
//                                     value="email"
//                                     onChange={(e) => onChange(e.target.value)}
//                                     checked={value === 'email'}
//                                     className="text-orange-600 w-5 h-5 border-gray-300 focus:ring-0 focus:ring-offset-0"
//                                 />
//                                 <span className="ml-2 text-gray-600">Email</span>
//                                 <input
//                                     type="radio"
//                                     value="phone"
//                                     onChange={(e) => onChange(e.target.value)}
//                                     checked={value === 'phone'}
//                                     className="text-orange-600 w-5 h-5 border-gray-300 focus:ring-0 focus:ring-offset-0"
//                                 />
//                                 <span className="ml-2 text-gray-600">Phone</span>
//                             </>
//                         )}
//                     />
//                     {sendType === 'email' && (
//                         <label className="block mt-6">
//                             <span className="block mb-1 text-gray-600">Email</span>
//                             <input
//                                 className="w-full rounded-lg border-gray-300 focus:ring-0 focus:border-orange-600  py-3"
//                                 type="text"
//                                 {...register('email', { shouldUnregister: true })}
//                             />
//                         </label>
//                     )}
//                     {sendType === 'phone' && (
//                         <>
//                             <label className="block mt-6">
//                                 <span className="block mb-1 text-gray-600">Phone</span>
//                                 <input
//                                     className="w-full rounded-lg border-gray-300 focus:ring-0 focus:border-orange-600  py-3"
//                                     type="number"
//                                     {...register('phoneNumber', { shouldUnregister: true })}
//                                 />
//                             </label>
//                             <label className="block mt-6">
//                                 <span className="block mb-1 text-gray-600">Second Phone</span>
//                                 <input
//                                     className="w-full rounded-lg border-gray-300 focus:ring-0 focus:border-orange-600  py-3"
//                                     type="number"
//                                     {...register('phoneNumber', { shouldUnregister: true })}
//                                 />
//                             </label>
//                         </>
//                     )}
//                     <button className="mt-12 w-full bg-orange-600 rounded-lg px-6 py-3 text-white font-medium">
//                         Order Package
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };
//
// export default App;




import { FC, useEffect } from "react";
import { z } from "zod";
import { useForm, SubmitHandler, Controller, useFieldArray } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";

const NoSchema = z.object({
    name: z.string(),
    address: z.string(),
    sendType: z.literal('no'),
});

const EmailSchema = z.object({
    name: z.string(),
    address: z.string(),
    sendType: z.literal('email'),
    email: z.string().email(),
});

const PhoneNumberSchema = z.object({
    name: z.string(),
    address: z.string(),
    sendType: z.literal('phone'),
    phoneNumbers: z.array(z.string().refine(val => val.length === 10, { message: "Phone number must be 10 digits long" })),
});

const FormSchema = z.union([
    NoSchema,
    EmailSchema,
    PhoneNumberSchema,
]);

type FormSchemaType = z.infer<typeof FormSchema>;

const App: FC = () => {
    const { register, watch, handleSubmit, control, setValue } = useForm<FormSchemaType>({
        resolver: zodResolver(FormSchema),
    });

    const sendType = watch("sendType");
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'phoneNumbers',
    });

    useEffect(() => {
        if (sendType === 'phone' && fields.length === 0) {
            append('');
        }
    }, [sendType, fields.length, append]);

    const onSubmit: SubmitHandler<FormSchemaType> = (data) => {
        console.log(data);
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="max-w-xl w-full mx-auto px-4 py-32">
                <form
                    className="bg-white rounded-lg px-8 py-12 shadow-lg"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <h1 className="text-orange-600 text-xl font-semibold mb-8">
                        Order Package
                    </h1>
                    <label className="block">
                        <span className="block mb-1 text-gray-600">Your name</span>
                        <input
                            className="w-full rounded-lg border-gray-300 focus:ring-0 focus:border-orange-600 py-3"
                            type="text"
                            {...register("name")}
                        />
                    </label>
                    <label className="block">
                        <span className="block mb-1 text-gray-600">Your address</span>
                        <input
                            className="w-full rounded-lg border-gray-300 focus:ring-0 focus:border-orange-600 py-3"
                            type="text"
                            {...register("address")}
                        />
                    </label>
                    <Controller
                        name="sendType"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <>
                                <input
                                    type="radio"
                                    value="no"
                                    onChange={(e) => onChange(e.target.value)}
                                    checked={value === 'no'}
                                    className="text-orange-600 w-5 h-5 border-gray-300 focus:ring-0 focus:ring-offset-0"
                                />
                                <span className="ml-2 text-gray-600">No</span>
                                <input
                                    type="radio"
                                    value="email"
                                    onChange={(e) => onChange(e.target.value)}
                                    checked={value === 'email'}
                                    className="text-orange-600 w-5 h-5 border-gray-300 focus:ring-0 focus:ring-offset-0"
                                />
                                <span className="ml-2 text-gray-600">Email</span>
                                <input
                                    type="radio"
                                    value="phone"
                                    onChange={(e) => onChange(e.target.value)}
                                    checked={value === 'phone'}
                                    className="text-orange-600 w-5 h-5 border-gray-300 focus:ring-0 focus:ring-offset-0"
                                />
                                <span className="ml-2 text-gray-600">Phone</span>
                            </>
                        )}
                    />
                    {sendType === 'email' && (
                        <label className="block mt-6">
                            <span className="block mb-1 text-gray-600">Email</span>
                            <input
                                className="w-full rounded-lg border-gray-300 focus:ring-0 focus:border-orange-600  py-3"
                                type="text"
                                {...register('email', { shouldUnregister: true })}
                            />
                        </label>
                    )}
                    {sendType === 'phone' && (
                        <>
                            <div key={fields[0]?.id} className="block mt-6">
                                <span className="block mb-1 text-gray-600">Phone</span>
                                <input
                                    className="w-full rounded-lg border-gray-300 focus:ring-0 focus:border-orange-600  py-3"
                                    type="text"
                                    {...register(`phoneNumbers.0`, { shouldUnregister: true })}
                                />
                            </div>
                            {fields.slice(1).map((item, index) => (
                                <div key={item.id} className="block mt-6">
                                    <span className="block mb-1 text-gray-600">Phone {index + 2}</span>
                                    <input
                                        className="w-full rounded-lg border-gray-300 focus:ring-0 focus:border-orange-600  py-3"
                                        type="text"
                                        {...register(`phoneNumbers.${index + 1}`, { shouldUnregister: true })}
                                    />
                                    <button type="button" onClick={() => remove(index + 1)} className="text-red-600 mt-2">Remove</button>
                                </div>
                            ))}
                            <button type="button" onClick={() => append('')} className="text-blue-600 mt-2">Add Phone Number</button>
                        </>
                    )}
                    <button className="mt-12 w-full bg-orange-600 rounded-lg px-6 py-3 text-white font-medium">
                        Order Package
                    </button>
                </form>
            </div>
        </div>
    );
};

export default App;



// import { FC, useState } from "react";
// import { z } from "zod";
// import { useForm, SubmitHandler, Controller, useFieldArray } from 'react-hook-form'
// import { zodResolver } from "@hookform/resolvers/zod";
//
// const NoSchema = z.object({
//     name: z.string(),
//     address: z.string(),
//     sendType: z.literal('no'),
// });
//
// const EmailSchema = z.object({
//     name: z.string(),
//     address: z.string(),
//     sendType: z.literal('email'),
//     email: z.string().email(),
// });
//
// const PhoneNumberSchema = z.object({
//     name: z.string(),
//     address: z.string(),
//     sendType: z.literal('phone'),
//     phoneNumbers: z.array(z.string()),
// });
//
// const FormSchema = z.union([
//     NoSchema,
//     EmailSchema,
//     PhoneNumberSchema,
// ]);
//
// type FormSchemaType = z.infer<typeof FormSchema>;
//
// const App: FC = () => {
//     const { register, watch, handleSubmit, control } = useForm<FormSchemaType>({
//         resolver: zodResolver(FormSchema),
//     });
//
//     const { fields, append, remove } = useFieldArray({
//         control,
//         name: "phoneNumbers",
//     });
//
//     const sendType = watch("sendType");
//
//     const onSubmit: SubmitHandler<FormSchemaType> = (data) => {
//         console.log(data);
//     };
//
//     const addPhoneNumber = () => {
//         append("");
//     };
//
//     return (
//         <div className="bg-gray-100 min-h-screen">
//             <div className="max-w-xl w-full mx-auto px-4 py-32">
//                 <form
//                     className="bg-white rounded-lg px-8 py-12 shadow-lg"
//                     onSubmit={handleSubmit(onSubmit)}
//                 >
//                     <h1 className="text-orange-600 text-xl font-semibold mb-8">
//                         Order Package
//                     </h1>
//                     <label className="block">
//                         <span className="block mb-1 text-gray-600">Your name</span>
//                         <input
//                             className="w-full rounded-lg border-gray-300 focus:ring-0 focus:border-orange-600 py-3"
//                             type="text"
//                             {...register("name")}
//                         />
//                     </label>
//                     <label className="block">
//                         <span className="block mb-1 text-gray-600">Your address</span>
//                         <input
//                             className="w-full rounded-lg border-gray-300 focus:ring-0 focus:border-orange-600 py-3"
//                             type="text"
//                             {...register("address")}
//                         />
//                     </label>
//                     <Controller
//                         name="sendType"
//                         control={control}
//                         render={({ field: { onChange, value } }) => (
//                             <>
//                                 <input
//                                     type="radio"
//                                     value="no"
//                                     onChange={(e) => onChange(e.target.value)}
//                                     checked={value === 'no'}
//                                     className="text-orange-600 w-5 h-5 border-gray-300 focus:ring-0 focus:ring-offset-0"
//                                 />
//                                 <span className="ml-2 text-gray-600">No</span>
//                                 <input
//                                     type="radio"
//                                     value="email"
//                                     onChange={(e) => onChange(e.target.value)}
//                                     checked={value === 'email'}
//                                     className="text-orange-600 w-5 h-5 border-gray-300 focus:ring-0 focus:ring-offset-0"
//                                 />
//                                 <span className="ml-2 text-gray-600">Email</span>
//                                 <input
//                                     type="radio"
//                                     value="phone"
//                                     onChange={(e) => onChange(e.target.value)}
//                                     checked={value === 'phone'}
//                                     className="text-orange-600 w-5 h-5 border-gray-300 focus:ring-0 focus:ring-offset-0"
//                                 />
//                                 <span className="ml-2 text-gray-600">Phone</span>
//                             </>
//                         )}
//                     />
//                     {sendType === 'email' && (
//                         <label className="block mt-6">
//                             <span className="block mb-1 text-gray-600">Email</span>
//                             <input
//                                 className="w-full rounded-lg border-gray-300 focus:ring-0 focus:border-orange-600  py-3"
//                                 type="text"
//                                 {...register('email', { shouldUnregister: true })}
//                             />
//                         </label>
//                     )}
//                     {sendType === 'phone' && (
//                         <>
//                             {fields.map((phone, index) => (
//                                 <div key={phone.id} className="flex items-center mt-6">
//                                     <label className="block">
//                                         <span className="block mb-1 text-gray-600">Phone</span>
//                                         <input
//                                             className="w-full rounded-lg border-gray-300 focus:ring-0 focus:border-orange-600  py-3"
//                                             type="number"
//                                             {...register(`phoneNumbers.${index}` as const)}
//                                         />
//                                     </label>
//                                     <button
//                                         type="button"
//                                         className="ml-4 bg-red-500 text-white rounded-lg px-4 py-2"
//                                         onClick={() => remove(index)}
//                                     >
//                                         Remove
//                                     </button>
//                                 </div>
//                             ))}
//                             <button
//                                 type="button"
//                                 className="mt-6 bg-blue-500 text-white rounded-lg px-4 py-2"
//                                 onClick={addPhoneNumber}
//                             >
//                                 Add Phone Number
//                             </button>
//                         </>
//                     )}
//                     <button className="mt-12 w-full bg-orange-600 rounded-lg px-6 py-3 text-white font-medium">
//                         Order Package
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };
//
// export default App