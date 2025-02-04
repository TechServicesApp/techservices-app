import React from "react";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Card from "@/components/ui/Card";
import { tableData } from "@/constant/table-data";
import { Button, Modal } from "@mui/material";

// ====

const FormValidationSchema = yup
    .object({
        username: yup.string().required(),
        number: yup.number().required().positive(),
        betweenNumber: yup
            .number()
            .required("The Number between field is required")
            .positive()
            .min(1)
            .max(10),

        alphabetic: yup
            .string()
            .required()
            .matches(/^[a-zA-Z]+$/, "Must only consist of alphabetic characters"),
        length: yup.string().required("The Min Character field is required").min(3),

        password: yup.string().required().min(8),
        url: yup.string().required("The URL field is required").url(),
        message: yup.string().required("The Message field is required"),
    })
    .required();


const columns = [
    {
        label: "Age",
        field: "age",
    },
    {
        label: "First Name",
        field: "first_name",
    },
    {
        label: "Email",
        field: "email",
    },
];

/**
 
 */
// slice(0, 10) is used to limit the number of rows to 10
const rows = tableData.slice(0, 7);
const ListCalendar = () => {
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({
        resolver: yupResolver(FormValidationSchema),
    });

    const onSubmit = (data) => {
        console.log(data);
    };
    return (
        <div className="grid  gap-5">
            <Card title="Mes programmes" noborder>
                <div className="overflow-x-auto -mx-6">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden ">
                            <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                                <thead className="bg-slate-200 dark:bg-slate-700">
                                    <tr>
                                        {columns.map((column, i) => (
                                            <th key={i} scope="col" className=" table-th ">
                                                {column.label}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                                    {rows.map((row, i) => (
                                        <tr key={i}>
                                            <td className="table-td">{row.age}</td>
                                            <td className="table-td">{row.first_name}</td>
                                            <td className="table-td ">{row.email}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Card>

            {/* ============ */}

            <Modal
                title="Programmer un rendezvous"
                label="Login Form"
                labelClass="btn-outline-dark"
                uncontrol
                footerContent={
                    <Button
                        text="Accept"
                        className="btn-dark "
                        onClick={() => {
                            alert("use Control Modal");
                        }}
                    />
                }
            >
                <div className="text-base text-slate-600 dark:text-slate-300">
                    <div className="xl:col-span-2 col-span-1">
                        <Card title="Validation Types">
                            <div>
                                <form
                                    onSubmit={handleSubmit(onSubmit)}
                                    className="lg:grid-cols-2 grid gap-5 grid-cols-1 "
                                >
                                    <Textinput
                                        label="Required"
                                        type="text"
                                        placeholder="Type your User Name"
                                        name="username"
                                        register={register}
                                        error={errors.username}
                                    />
                                    <Textinput
                                        label="Must only consist of numbers"
                                        type="text"
                                        placeholder="Enter Number Only"
                                        name="number"
                                        register={register}
                                        error={errors.number}
                                    />
                                    <Textinput
                                        label="Range Value"
                                        type="text"
                                        placeholder="Enter Number between 1 & 10"
                                        name="betweenNumber"
                                        register={register}
                                        error={errors.betweenNumber}
                                    />

                                    <Textinput
                                        label="alphabetic characters"
                                        type="text"
                                        placeholder="Enter Character Only"
                                        name="alphabetic"
                                        register={register}
                                        error={errors.alphabetic}
                                    />

                                    <Textinput
                                        label="Length should not be less than the specified length : 3"
                                        type="text"
                                        placeholder="Enter minimum 3 Characters"
                                        name="length"
                                        register={register}
                                        error={errors.length}
                                    />
                                    <Textinput
                                        label="Password"
                                        type="password"
                                        placeholder="8+ characters, 1 Capital letter "
                                        name="re_password"
                                        register={register}
                                        error={errors.password}
                                    />
                                    <Textinput
                                        label="Must be a valid url"
                                        type="url"
                                        placeholder="Enter Valid URL"
                                        name="re_url"
                                        register={register}
                                        error={errors.url}
                                    />
                                    <Textarea
                                        label="Message"
                                        placeholder="Write Your Message"
                                        name="re_msg"
                                        register={register}
                                        error={errors.message}
                                    />

                                    <div className="lg:col-span-2 col-span-1">
                                        <div className="ltr:text-right rtl:text-left">
                                            <button className="btn btn-dark  text-center">
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </Card>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ListCalendar;
