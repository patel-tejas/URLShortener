"use client";

import React, { useState } from 'react'
import axios from 'axios'
import Link from 'next/link';
import Image from 'next/image';
import heroImg from "@/images/heroImg.png"
import { nanoid } from "nanoid";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Tooltip,
  Select,
  SelectItem,

} from "@heroui/react";
import { LinkModel } from '@/models/Link';

const Page = () => {
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [shortenurl, setShortenUrl] = useState<string>(nanoid(5));
  const [expireAfterSeconds, setExpireAfterSeconds] = useState<string>("null");

  const [LinkData, setLinkData] = useState<LinkModel>();

  const PRODUCTION = true;
  const URL = PRODUCTION ? "https://url-shortener.vercel.app" : "http://localhost:3000"

  // Code for modal 
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData: FormData = new FormData(e.target as HTMLFormElement)
    const url = formData.get('url') as string
    const shorturl = formData.get('shorturl') as string
    try {
      const LinkData = await axios.post('api/shorten-url', { url, shorturl, expireAfterSeconds })
      console.log(LinkData);
      setLinkData(LinkData.data)
      setStatus('success')
      onOpen()

    } catch (error) {
      setStatus('error');

      if (axios.isAxiosError(error)) {
        console.log(error.response?.data?.error || "An error occurred");
        setError(error.response?.data?.error || "An unknown error occurred");
      } else {
        console.log("Unexpected error:", error);
        setError("An unexpected error occurred");

      }
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(`${URL}/url/${LinkData?.shorten_url}`);
    alert("Copied to Clipboard!");
  };

  const SelectInput: React.FC = () => {
    // Values are in seconds
    const options = [
      { value: "null", label: "Never Expire" },
      { value: "60", label: "Expire After 1 Minute" },
      { value: "600", label: "Expire After 10 Minutes" },
      { value: "3600", label: "Expire After 1 Hour" },
      { value: "86400", label: "Expire After 1 Day" },
      { value: "604800", label: "Expire After 1 Week" },
      { value: "2629800", label: "Expire After 1 Month" },
    ];
    return (
      <>
        <Select
          label="Expires After"
          placeholder="Select an Expiration Time"
          variant="faded"
          name="expireAfterSeconds"
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setExpireAfterSeconds(e.target.value)}
          selectedKeys={expireAfterSeconds ? [expireAfterSeconds] : ["null"]}
          className='dark'
        >
          {options.map((option) => (
            <SelectItem className='dark' key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </Select>
      </>
    );
  };

  return (
    <div className='container mx-auto max-w-5xl py-10 sm:py-5 px-2 min-h-screen'>
      <header className='text-center w-[100%] sm:w-[75%] sm:py-4 flex items-center justify-center mx-auto h-[8rem] sm:h-[18rem]'>

        <Image alt="heroImg" src={heroImg} className='sm:w-full sm:h-full' />

      </header>
      <main className='mt-5 w-full'>
        <form onSubmit={handleSubmit} className='flex flex-col items-center w-full gap-5'>
          <Tooltip
            content="This is the URL you want to shorten"
            offset={20}
            placement="right-end"
            showArrow
            color="primary"
          >
            <label
              htmlFor="url"
              className="relative w-full sm:w-1/3 block overflow-hidden border-b bg-transparent pt-3 hover:border-blue-600 border-gray-700 text-xl"
            >
              <input
                type="text"
                id="url"
                name="url"
                placeholder="url"
                className="peer h-12 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 text-sm sm:text-base text-white rounded-xl"
              />
              <span
                className="absolute start-0 top-2 -translate-y-1/2 text-xl transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs text-gray-400 peer-focus:text-white"
              >
                Original URL
              </span>
            </label>
          </Tooltip>
          <Tooltip
            content={
              <>
                Shortened would be:
                <b>{`${URL}/url/${shortenurl}`}</b>
              </>
            }
            offset={20}
            placement="right-end"
            showArrow
            color="default"
          >
            <label
              htmlFor="shorturl"
              className="relative w-full text-xl sm:w-1/3 block overflow-hidden border-b  bg-transparent pt-3 hover:border-blue-600 border-gray-700 "
            >
              <input
                type="text"
                id="shorturl"
                name="shorturl"
                placeholder="shorturl"
                className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 text-sm sm:text-base text-white"
                value={shortenurl}
                onChange={(e) => setShortenUrl(e.target.value)}
              />

              <span
                className="absolute start-0 top-2 -translate-y-1/2 text-xs transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs text-gray-200"
              >
                Shorten URL
              </span>
            </label>
          </Tooltip>
          <div className='w-full sm:w-1/3 mx-auto'>
            <SelectInput />
          </div>
          <button type='submit' className='bg-blue-500 hover:bg-blue-600 duration-200 text-white font-bold py-2 px-4 rounded-xl w-full sm:w-1/3 mt-5'>Shorten URL</button>
        </form>

        <Modal isOpen={isOpen} size={"md"} onClose={onClose} backdrop='blur' className='dark'>
          <ModalContent className='bg-slate-900'>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 text-green-500">Link Shorten Successfully</ModalHeader>
                <ModalBody className='text-white'>
                  <p>The Shortern URL is: <span className='font-bold italic text-red-400'>{`${URL}/url/${LinkData?.shorten_url}`}</span></p>
                  {
                    expireAfterSeconds !== "null" && (
                      <p>Link will expire at: <span className='font-bold italic text-red-400'>{new Date(Date.now() + parseInt(expireAfterSeconds) * 1000).toLocaleString()}</span></p>
                    )
                  }
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    <Link href={`${URL}/url/${LinkData?.shorten_url}`}>
                      Go to Link
                    </Link>
                  </Button>
                  <Button color="primary" variant="solid" onPress={copyUrl}>
                    Copy to Clipboard
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        {
          status === 'error' && (
            <div className='flex flex-col items-center mt-5 text-white gap-3'>
              <p className='text-lg text-red-400'>Error occured while shortening the URL! 🚨</p>
              <p>{error}</p>
            </div>
          )
        }

      </main>
    </div>

  )
}

export default Page;