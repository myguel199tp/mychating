"use client";
import React, { useState } from "react";
import {
  InputField,
  SelectField,
  Buton,
  Text,
  Title,
  Flag,
} from "complexes-next-components";
import useForm from "./use-form";

export default function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    isSuccess,
    onSubmit,
  } = useForm();
  const [selectedOption, setSelectedOption] = useState("");

  const options = [
    { value: "Bogotá", label: "Bogotá" },
    { value: "Medellin", label: "Medellin" },
    { value: "Cali", label: "Cali" },
  ];

  return (
    <div>
      {isSuccess && (
        <Flag colVariant="success" background="success" size="sm" rounded="lg">
          ¡Operación exitosa!
        </Flag>
      )}
      <Title size="md" className="m-4" font="semi" as="h2">
        Crear cuenta
      </Title>
      <div className="w-full flex gap-2 justify-center">
        <form className="w-[50%]" onSubmit={handleSubmit(onSubmit)}>
          <InputField
            placeholder="nombre"
            inputSize="full"
            rounded="lg"
            className="mt-2"
            type="text"
            {...register("name")}
            hasError={!!errors.name}
            errorMessage={errors.name?.message}
          />
          <InputField
            placeholder="apellido"
            inputSize="full"
            rounded="lg"
            className="mt-2"
            type="text"
            {...register("lastName")}
            hasError={!!errors.lastName}
            errorMessage={errors.lastName?.message}
          />
          <SelectField
            className="mt-2"
            id="city"
            value={selectedOption}
            options={options}
            inputSize="full"
            rounded="lg"
            hasError={!!errors.city}
            {...register("city", {
              onChange: (e) => setSelectedOption(e.target.value),
            })}
          />
          <InputField
            placeholder="Celular"
            inputSize="full"
            rounded="lg"
            className="mt-2"
            type="text"
            {...register("phone")}
            hasError={!!errors.phone}
            errorMessage={errors.phone?.message}
          />
          <InputField
            placeholder="correo electronico"
            inputSize="full"
            rounded="lg"
            className="mt-2"
            type="email"
            {...register("email")}
            hasError={!!errors.email}
            errorMessage={errors.email?.message}
          />

          <InputField
            placeholder="contraseña"
            inputSize="full"
            rounded="lg"
            className="mt-2"
            type="password"
            {...register("password")}
            hasError={!!errors.password}
            errorMessage={errors.password?.message}
          />

          <div className="flex items-center mt-3">
            <input type="checkbox" {...register("termsConditions")} />
            <label htmlFor="termsCondition" className="text-sm">
              Acepto los términos y condiciones
            </label>
          </div>
          {errors.termsConditions && (
            <p className="text-red-500 text-sm mt-1">
              {errors.termsConditions.message}
            </p>
          )}
          <div className="mt-3 flex justify-center">
            <Buton
              colVariant="primary"
              size="lg"
              rounded="lg"
              borderWidth="semi"
              type="submit"
            >
              <Text>Registrarse</Text>
            </Buton>
          </div>
        </form>
      </div>
    </div>
  );
}
