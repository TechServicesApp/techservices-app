import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Dropdown from "@/components/ui/Dropdown";
// import menu form headless ui
import { Menu } from "@headlessui/react";
import Icon from "@/components/ui/Icon";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProjectGrid = ({ project }) => {
  const { details,devisInfo,created_at,type } =
    project;
  const dispatch = useDispatch();



  const navigate = useNavigate();
  // handleClick to view project single page
  const handleClick = (project) => {
    navigate(`/visualisationbesoin_archi/${project.id}`);
  };

  return (
    <Card  className="bg-white  rounded-lg ">
      {/* header */}
      <header className="flex justify-between items-end">
        <div className="flex space-x-4 items-center rtl:space-x-reverse">
          <div className="flex-none">
           
          </div>
          <div className="font-medium text-base leading-6">
            <div className="dark:text-slate-200 text-[#FFFFFF] max-w-[160px] truncate font-bold uppercase">
              {type}
            </div>
          </div>
        </div>
        <div>
          <Dropdown
            classMenuItems=" w-[130px]"
            label={
              <span className="text-lg inline-flex flex-col items-center justify-center h-8 w-8 rounded-full bg-gray-500-f7 dark:bg-slate-900 dark:text-slate-400">
                <Icon icon="heroicons-outline:dots-vertical" />
              </span>
            }
          >
            <div>
              <Menu.Item onClick={() => handleClick(project)}>
                <div
                  className="hover:bg-slate-900 dark:hover:bg-slate-600 dark:hover:bg-opacity-70 hover:text-white
                   w-full border-b border-b-gray-500 border-opacity-10   px-4 py-2 text-sm dark:text-slate-300  last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex  space-x-2 items-center
                     capitalize rtl:space-x-reverse"
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
      {/* description */}
      <div className="text-white text-slate-600 dark:text-slate-400 text-sm pt-4  mt-1.5 mb-2 line-clamp-3">
        {details}
      </div>
      {/* assignee */}
      <div className=" mt-6">
        <div className="pb-4">
         
          <div className="flex justify-start -space-x-1.5 rtl:space-x-reverse">
            
              <div
                className="h-6 w-6 rounded-full ring-1 ring-slate-100 mr-3"
               
              >
                <img
                  src={devisInfo?.picture}
                 
                  className="w-full h-full rounded-full"
                />
              </div>
           
              <div className="text-[#FFFFFF] flex-none text-slate-600 dark:text-white text-sm font-normal items-center lg:flex  text-ellipsis whitespace-nowrap">
        <span className="text-[#FFFFFF] text-ellipsis whitespace-nowrap w-[85px] block">
          {devisInfo?.nom}
        </span>
       
      </div>
          </div>
          </div>
        
      <div className="flex justify-start -space-x-1.5 rtl:space-x-reverse">
        {/* start date */}
        <div>
          <span className="text-white text-slate-400 dark:text-slate-400 text-sm flex font-normal mb-1"> <Icon icon="heroicons-outline:calendar" /> &nbsp; Date envoie</span>
          <span className="text-white block date-text">{ new Date(
                          created_at.seconds * 1000
                        ).toLocaleDateString()}</span>
        </div>
      
        {/* total date */}
     
      </div>
      </div>
    </Card>
  );
};

export default ProjectGrid;
