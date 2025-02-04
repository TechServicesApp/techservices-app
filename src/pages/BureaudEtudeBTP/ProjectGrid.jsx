import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Dropdown from "@/components/ui/Dropdown";
// import menu form headless ui
import { Menu } from "@headlessui/react";
import Icon from "@/components/ui/Icon";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProjectGrid = ({ project }) => {
  const { details,devisInfo,created_at,NatureTravaux } =
    project;
  const dispatch = useDispatch();



  const navigate = useNavigate();
  // handleClick to view project single page
  const handleClick = (project) => {
    navigate(`/visualisationbesoin_bureau/${project.id}`);
  };

  return (
    <Card className="bg-white  rounded-lg ">
    {/* En-tête */}
    <header className="flex justify-between items-end">
      <div className="flex space-x-4 items-center rtl:space-x-reverse">
        <div className="font-medium text-base leading-6">
          <div className="text-black max-w-[160px] truncate font-bold uppercase">
            {NatureTravaux}
          </div>
        </div>
      </div>
      <div>
        <Dropdown
          classMenuItems=" w-[130px]"
          label={
            <span className="text-lg inline-flex flex-col items-center justify-center h-8 w-8 rounded-full bg-gray-200 text-black">
              <Icon icon="heroicons-outline:dots-vertical" />
            </span>
          }
        >
          <div>
            <Menu.Item onClick={() => handleClick(project)}>
              <div
                className="hover:bg-[#EAF6FF] hover:text-black w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm text-black cursor-pointer first:rounded-t last:rounded-b flex space-x-2 items-center capitalize rtl:space-x-reverse"
              >
                <span className="text-base">
                  <Icon icon="heroicons:eye" />
                </span>
                <span>Voir plus</span>
              </div>
            </Menu.Item>
          </div>
        </Dropdown>
      </div>
    </header>

    {/* Description */}
    <div className="text-black text-sm pt-4 mb-2 line-clamp-3">{details}</div>

    {/* Assignation */}
    <div className="mt-6">
      <div className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="h-6 w-6 rounded-full ring-1 ring-[#067BBF]">
            <img
              src={devisInfo?.picture}
              alt="devis"
              className="w-full h-full rounded-full"
            />
          </div>
          <div className="text-black text-sm font-normal">
            {devisInfo?.nom}
          </div>
        </div>
      </div>

      {/* Date */}
      <div className="flex justify-start space-x-4">
        <div>
          <span className="text-black text-sm flex items-center mb-1">
            <Icon icon="heroicons-outline:calendar" /> &nbsp; Date envoie
          </span>
          <span className="text-black block">
            {new Date(created_at.seconds * 1000).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  </Card>
  );
};

export default ProjectGrid;
