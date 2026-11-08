import { reqresTypes } from "../types/userTypes"
import { db } from "../db/db"
import type { Request, Response } from "express"
import { prisma } from "@repo/db";

// getting user
export const getUser = async (req: Request, res: Response) => {
    if (!req.user?.id) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    const id: string = req.user?.id as string;

    try {
        const user = await db.user.findUnique({
            where: {
                id: id,
            },
        });


        return res.status(200).json({ "user": user });


    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ "error": error })
    }
}

// update user 
export const updateUser = async (req: Request, res: Response) => {
    if (!req.user?.id) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    const id: string = req.user?.id as string;
    const {name, phone, bio, hourlyRate, address, userSkill} = req.body;
    // console.log(id)
    try {
        const response = await db.user.update({
            where: {
                id: id,
            },
            data: {
                name: name,
                bio: bio,
                phone: phone,
                hourlyRate:hourlyRate,
                address:address,
                userSkill:userSkill
            }
        });

        return res.status(200).json({
            message: "User updated successfully",
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal server error" });
    }

}


// create address 

export const UserAddress = async (req: Request, res: Response) => {
    if (!req.user?.id) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    console.log("request Reached for adddress  updation");
    const id: string = req.user?.id as string;
    const { city, state, country, zipCode, street } = req.body;
    console.log(id);
    try {
        console.log("inside try  catch")
        const address = await db.address.upsert({
            where: {
                id: id
            },
            update: {
                city: city,
                state: state,
                country: country,
                zipCode: zipCode,
                street: street,
            },
            create: {
                city: city,
                state: state,
                country: country,
                zipCode: zipCode,
                street: street,
                userId: id
            },
        });
        // console.log(address);
        return res.status(200).json({
            message: "Address saved Successfully",
            address
        })
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: "Failed to save address",
        });
    }

}


// create skills 
export const CreateSkill = async (req: Request, res: Response) => {
    if (!req.user?.id) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    if (!req.user?.id) {
        return res.status(404).json()
    }
    const userid: string = req.user?.id as string;
    const skills: string[] = req.body.skills;

    console.log(userid);

    if (!userid) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const skillRecords = await db.$transaction(
            skills.map((skillName) => {
                return db.skill.upsert({
                    where: { name: skillName.toLowerCase() },
                    update: {},
                    create: { name: skillName.toLowerCase() },
                });
            })
        );

        // userid linked to skills
        await db.$transaction(
            skillRecords.map((skill) =>
                db.userSkill.upsert({
                    where: {
                        userId_skillId: {
                            userId: userid,
                            skillId: skill.id,
                        },
                    },
                    update: {},
                    create: {
                        userId: userid,
                        skillId: skill.id,
                    },
                })
            )
        );

        return res.status(200).json({ message: "Skills updated" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Failed to update skills" });
    }
}

//get skills data
export  const getUserSkill = async (req:Request, res:Response) => {
    if (!req.user?.id) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    if (!req.user?.id) {
        return res.status(404).json()
    }
    const userid: string = req.user?.id as string;
    
    console.log(userid);

    if (!userid) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const skills = await db.userSkill.findMany({
            where: {
                userId:userid,
            },
            include: {
                skill:true,
            },
        });

        return res.status(200).json({
            skills:skills.map((item) => item.skill),
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal server error Failed to fetch skills"
        })
    }
}

//delete user 
export const DeleteAccount = async (req: Request, res: Response) => {
    const id: string = req.user?.id as string;
    console.log(id);

    if (!id) {
        res.status(404).json({
            message: "User Not Found!"
        })
    }

    try {
        const user = await prisma.user.delete({
            where: {
                id: id
            }
        })

        console.log("Deleted User", user);

        return res.status(200).json({
            message: "Account deleted successfully"
        })
    } catch (err) {
        console.log("ERROR", err);
        return res.status(500).json({
            message: "Internal Server Error Please Try Again Later!"
        })
    }
}