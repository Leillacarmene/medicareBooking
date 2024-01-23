import express from 'express'
import {
    getAllReviews,
     createReview }
      from '../Controllers/reviewController.js'
import { authenticate,restrict } from './../auth/verfyToken.js'
const router =express.Router({mergeParams:true});

//doctor/doctotrId
router.
route('/')
.get(getAllReviews)
.post(authenticate,restrict(['patient']), createReview);

export default router;