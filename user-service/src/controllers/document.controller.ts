import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Document from "../models/document.model";
import { publishEvent } from "../events/publisher";
import { Op, Sequelize } from "sequelize";

export const createDocument: any = asyncHandler(async (req: Request, res: Response) => {
  const { patientId, name, date, userId } = req.body;

  const document = await Document.create({
    patientId,
    name,
    date,
    userId
  });

     await publishEvent("document_events", "DOCUMENT_REGISTERED", {
        userId: userId,
      });

  res.status(201).json({
    success: true,
    message: "Document created successfully",
    data: document,
  });
});



export const getDocuments = asyncHandler(
  async (req: Request, res: Response) : Promise<void> => {
    const normalizeQuery = (value: any) =>
      Array.isArray(value) ? value[0] : value;


    let {
      userId,
      patientId,
      date,
      search_query,
      page = 1,
      limit = 10,
    }: any = req.query;

    userId = normalizeQuery(userId);
    patientId = normalizeQuery(patientId);
    date = normalizeQuery(date);
    search_query = normalizeQuery(search_query);
    page = normalizeQuery(page);
    limit = normalizeQuery(limit);


    const whereClause: any = {};
    const andConditions: any[] = [];

     const pageNum = Math.max(Number(page) || 1, 1);
    const limitNum = Math.max(Number(limit) || 10, 1);

    if (patientId && !isNaN(Number(patientId))) {
      whereClause.patientId = Number(patientId);
    }


    if (userId && !isNaN(Number(userId))) {
      whereClause.userId = Number(userId);
    }

        if (date) whereClause.date = date;

      if (search_query?.trim()) {
          andConditions.push({
            [Op.or]: [
            
                Sequelize.where(
                Sequelize.fn(
                  "COALESCE",
                  Sequelize.col("name"),
                  ""
                ),
                {
                  [Op.iLike]: `%${search_query.trim()}%`,
                }
              ),
               
          
            ],
          });
        }


    if (andConditions.length) {
      whereClause[Op.and] = andConditions;
    }

    const documents = await Document.findAndCountAll({
      where: whereClause,
       limit: limitNum,
      offset: (pageNum - 1) * limitNum,
      order: [["createdAt", "DESC"]],
    });



      res.status(200).json({
      success: true,
      data: documents.rows,
      pagination: {
        totalItems: documents.count,
        totalPages: Math.ceil(documents.count / limitNum),
        currentPage: pageNum,
        limit: limitNum,
      },
      error: null,
    });

    return;
  }

);

export const getDocument: any = asyncHandler(async (req: Request, res: Response) => {
  const document = await Document.findOne({
    where: { id: req.params.id, isActive: true },
  });

  if (!document) {
    res.status(404).json({
      success: false,
      message: "Document not found",
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: document,
  });
});

export const updateDocument: any = asyncHandler(async (req: Request, res: Response) => {
  const document = await Document.findOne({
    where: { id: req.params.id },
  });

  if (!document) {
    res.status(404).json({
      success: false,
      message: "Document not found",
    });
    return;
  }

  await document.update(req.body);

    await publishEvent("document_events", "DOCUMENT_UPDATED", {
        userId: document.userId,
      });

  res.status(200).json({
    success: true,
    message: "Document updated successfully",
    data: document,
  });
});

export const deleteDocument = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  
  const findDocument = await Document.findByPk(req.params.id);
  
  const deletedCount = await Document.destroy({
    where: {
      id: req.params.id,
    },
  });

  if (deletedCount === 0) {
     res.status(404).json({
      success: false,
      message: "Document not found",
    });

      return ;
  }

    await publishEvent("document_events", "DOCUMENT_DELETED", {
        userId: findDocument.userId,
      });

res.status(200).json({
    success: true,
    message: "Document deleted successfully",
  });
    return;
});
