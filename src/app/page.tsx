"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import md5 from "crypto-js/md5";
import package_json from "@/../package.json";

export default function Root() {
  const [display, setDisplay] = useState<Promise<React.JSX.Element>[]>();

  const regen = (id_card: string) => {
    const sub = new Date().toISOString().split(":");
    const YYYY_MM_DDhhmm = (sub[0] + sub[1]).split("T").join("");
    const hash = md5(id_card + YYYY_MM_DDhhmm).toString();
    const take = hash.slice(0, 6).toUpperCase();
    return { password: take };
  };

  // กรณีใช้ฟังก์ชันโดยตรง
  useEffect(() => {
    const interval = setInterval(async () => {
      let temp1 = [];
      if (localStorage.getItem("array_authen")) {
        temp1 = JSON.parse(localStorage.getItem("array_authen")!);
      }
      const temp2 = temp1.map(async (i: any, index: number) => {
        const password = regen(i["id_card"])["password"];
        return (
          <Item
            key={index}
            label={i["label"]}
            password={password}
            id={i["id"]}
          />
        );
      });
      setDisplay(temp2);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className=" bg-black text-white absolute w-full h-full flex justify-center items-center p-2">
      <div className=" overflow-hidden flex flex-col w-full max-w-[25rem] items-center relative border border-gray-500 rounded-lg h-full">
        <h1 className=" leading-none py-10 text-[2rem] animate-pulse flex flex-col justify-center items-center bg-yellow-500 w-full text-black font-extrabold">
          <div>Authenticator</div>
          <p className=" text-[1.4rem] flex items-center gap-3">
            {`Dev by Geeleed v.${package_json.version}`}
          </p>
        </h1>
        {display}
        <Image
          priority={true}
          onClick={async () => {
            const label = prompt("ป้ายกำกับ");
            const id_card = prompt("Authentication ID");
            if (!label && !id_card) return;
            if (confirm("ยืนยันเพิ่มรายการ")) {
              const arr = [
                ...JSON.parse(localStorage.getItem("array_authen") || "[]"),
                { id: new Date().getTime(), label, id_card },
              ];
              localStorage.setItem("array_authen", JSON.stringify(arr));
            }
          }}
          src={"/svgs/pen-add.svg"}
          height={50}
          width={50}
          alt=""
          className=" transition-all active:scale-[0.85] cursor-pointer rounded-full p-2 bg-white shadow-[0px_0px_10px_#ffffff] absolute bottom-3 right-3"
        />
      </div>
    </div>
  );
}
const Item = ({
  label,
  password,
  id,
}: {
  label: string;
  password: string;
  id: number;
}) => {
  const del = (id: number) => {
    const temp1 = JSON.stringify(
      JSON.parse(localStorage.getItem("array_authen")!).filter(
        (item: any) => item["id"] !== id
      )
    );
    localStorage.setItem("array_authen", temp1);
  };
  return (
    <div className=" w-full px-5 py-2 flex justify-between items-center border-b border-gray-500 rounded-lg ">
      <div>
        <h3 className=" text-[1.5rem]">{label}</h3>
        <p className=" text-[2rem] text-yellow-300 ">{password}</p>
      </div>
      <p
        className={
          " absolute right-20 text-[1.5rem] " +
          (60 - parseInt(new Date().getSeconds().toString()) < 10 &&
            "text-red-600")
        }
      >
        {60 - parseInt(new Date().getSeconds().toString())}
      </p>
      <svg
        onClick={() => del(id)}
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        fill="currentColor"
        className="bi bi-x-circle transition-all active:scale-[0.85] cursor-pointer"
        viewBox="0 0 16 16"
      >
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
      </svg>
    </div>
  );
};
