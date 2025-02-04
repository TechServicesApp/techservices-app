import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Checkbox from "@/components/ui/Checkbox";
import Button from "@/components/ui/Button";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "@/store/api/auth/authApiSlice";
import { setUser } from "@/store/api/auth/authSlice";
import { toast } from "react-toastify";
import { auth, db, imgdb } from "@/firebaseconfig";
import {
  collection,
  where,
  query,
  getDocs,
  addDoc,
  setDoc,
  doc,
} from "firebase/firestore";
const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is Required"),
    password: yup.string().required("Password is Required"),
  })
  .required();
const LoginForm = () => {
  const [login, { isLoading, isError, error, isSuccess }] = useLoginMutation();

  const dispatch = useDispatch();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    //
    mode: "all",
  });

  const navigate = useNavigate();
  const onSubmit = async (data, e) => {
    try {
      await auth
        .signInWithEmailAndPassword(email, password)
        .then((response) => {
          toast.success("success");
          dispatch(setUser(data));

          try {
          } catch (error) {
            console.error(
              "Erreur lors de la récupération du document : ",
              error
            );
          }
        });
      const q = query(
        collection(db, "Quincaillerie"),
        where("email", "==", email)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        localStorage.setItem("quincailler", doc.id);
      });

     
      navigate("/dashboard");
    } catch (error) {
      var errorCode = error.code;
      if (errorCode === "auth/invalid-credential") {
        toast.error("email ou mot de passe incorrect");
      } else {
        console.log(error.code);
      }
    }
  };

  const [checked, setChecked] = useState(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
      <Textinput
        name="email"
        label="email"
        type="email"
        register={register}
        error={errors.email}
        value={email}
        onChange={(e) => setemail(e.target.value)}
        className="h-[48px]"
      />
      <Textinput
        name="password"
        label="mots de passe"
        type="password"
        value={password}
        onChange={(e) => setpassword(e.target.value)}
        register={register}
        error={errors.password}
        className="h-[48px]"
      />
      <div className="flex justify-between">
        <Checkbox
          value={checked}
          onChange={() => setChecked(!checked)}
          label="Rester Connecté"
        />
        <Link
          to="/forgot-password"
          className="text-sm text-slate-800 dark:text-slate-400 leading-6 font-medium"
        >
          Mot de passe oublié?{" "}
        </Link>
      </div>

      <Button
        type="submit"
        text="Sign in"
        className="btn btn-dark block w-full text-center "
        isLoading={isLoading}
      />
    </form>
  );
};

export default LoginForm;
