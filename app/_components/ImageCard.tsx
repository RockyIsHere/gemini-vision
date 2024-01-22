"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { ImageDown } from "lucide-react";
import React, { ChangeEvent, useState } from "react";

type Product = {
  name: string;
  company: string;
  count: number;
};

const ImageCard = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadings, setLoadings] = useState<boolean>(false);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log("This");
    const file = event.target.files?.[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedFile(file);
      console.log(imageUrl);
      setSelectedImage(imageUrl);
    }
  };
  const generateVision = async () => {
    try {
      setLoadings(true);
      const formData = new FormData();
      formData.append("file", selectedFile as File);
      console.log(formData);
      const apiResponse = await axios.post("/api", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = apiResponse.data;
      console.log(data);
      parseData(data);
      setLoadings(false);
      toast.success("Products are parsed successfully");
    } catch (error) {
      console.log(error);
      setLoadings(false);
      toast.error("Product was not parsed properly");
    }
  };
  const parseData = (data: any) => {
    const productList = data.products as Product[];
    setProducts(productList);
  };
  return (
    <div className=" w-full flex flex-col sm:flex-row justify-center sm:items-start items-center sm:space-x-6 space-y-6 sm:space-y-0">
      <div className=" w-[400px] flex flex-col space-y-2">
        <div className="h-[250px] w-full flex  border border-dashed rounded justify-center items-center">
          {!selectedImage && <ImageDown className=" h-10 w-10" />}
          {selectedImage && selectedFile && (
            <img
              src={selectedImage}
              alt="Selected Image"
              className=" max-w-full h-full"
              // style={{ maxWidth: "100%",  marginTop: "10px" }}
            />
          )}
        </div>
        <Input type="file" accept="image/*" onChange={handleImageChange} />
        <Button disabled={!selectedFile || loadings} onClick={generateVision}>
          {loadings ? "Generating..." : "Generate"}
        </Button>
      </div>
      <div>
        <Table className="">
          <TableCaption>A list of products.</TableCaption>
          <TableHeader className=" bg-slate-800 text-white rounded-t">
            <TableRow>
              <TableHead className=" min-w-[230px] text-white">
                Product Name
              </TableHead>
              <TableHead className=" text-white min-w-[280px]">
                Company
              </TableHead>
              <TableHead className="text-right text-white">Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product: Product, index: number) => {
              return (
                <TableRow key={index}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.company}</TableCell>
                  <TableCell className="text-right">{product.count}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ImageCard;
