/*
  Warnings:

  - A unique constraint covering the columns `[productId,mediaId]` on the table `ProductImage` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProductImage_productId_mediaId_key" ON "ProductImage"("productId", "mediaId");
