import z from "zod"



export const LoginShema=z.object({
    email:z.string().email("gecerli bir email giriniz"),
    password:z.string().min(5,"sifre en az 5 karakter olmalı")
})
export const RegisterShema=z.object({
    firstName:z.string(),
    lastname:z.string(),
    email:z.string().email("gecerli bir email giriniz"),
    password:z.string().min(5,"sifre en az 5 karakter olmalı")
})
export const ChangePassShema=z.object({
    oldPass:z.string().min(5,"sifre en az 5 karakter olmalı"),
    newPass:z.string().min(5,"sifre en az 5 karakter olmalı")
})
export const UpdateUserShema=z.object({
    firstName:z.string(),
    lastName:z.string(),
    email:z.string().email("gecerli bir email giriniz"),
})