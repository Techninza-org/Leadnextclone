
import { z, ZodIssue } from 'zod';
import leadWorker from '../workers/leadWorker';
import { createLeadSchema, leadAssignToSchema, leadBidSchema, submitFeedbackSchema } from '../types/lead';
import logger from '../utils/logger';
import { loggedUserSchema } from '../types/user';

export const leadResolvers = {
    getAllLeads: async () => {
        try {
            return await leadWorker.getAllLeads();
        } catch (error) {
            logger.error('Error fetching lead [getAllLeads]:', error);
            throw new Error('Error fetching lead');
        }
    },

    getLeadsByDateRange: async ({ companyId, startDate, endDate }: { companyId: string, startDate: string, endDate: string }) => {
        try {
            console.log('companyId', companyId, 'startDate', startDate, 'endDate', endDate);
            return await leadWorker.getLeadsByDateRange(companyId, startDate, endDate);
        } catch (error) {
            logger.error('Error fetching lead [getLeadsByDateRange]:', error);
            throw new Error(`Error fetching lead ${error}`);
        }
    },

    getCompanyLeads: async ({ companyId }: { companyId: string }, ctx: any) => {
        try {
            return await leadWorker.getCompanyLeads(companyId);
        } catch (error) {
            logger.error('Error fetching lead [getCompanyLeads]:', error);
            throw new Error('Error fetching lead');
        }
    },

    getAssignedLeads: async ({ userId }: { userId: string }, { user }: { user: z.infer<typeof loggedUserSchema> }) => {
        try {
            return await leadWorker.getAssignedLeads(userId, user?.companyId);
        } catch (error) {
            logger.error('Error fetching lead [getAssignedLeads]:', error);
            throw new Error('Error fetching lead');
        }
    },
    getCompanyLeadById: async ({ companyId, leadId }: { companyId: string, leadId: string }) => {
        try {
            return await leadWorker.getCompanyLeadById(companyId, leadId);
        } catch (error) {
            logger.error('Error fetching lead [getCompanyLeadById]:', error);
            throw new Error('Error fetching lead');
        }
    },
    createLead: async ({ input }: { input: z.infer<typeof createLeadSchema> }) => {
        try {
            const parsedData = createLeadSchema.safeParse(input);

            if (!parsedData.success) {
                const errors = parsedData.error.errors.map((err: ZodIssue) => ({
                    message: err.message,
                    path: err.path,
                }));
                return { user: null, errors };
            }

            return await leadWorker.createLead(parsedData.data);
        } catch (error) {
            logger.error('Error Creating lead:', error);
            throw new Error('Error Creating lead');
        }
    },

    appvedLead: async ({ leadId, status }: { leadId: string, status: boolean }) => {
        try {
            return await leadWorker.approveLead(leadId, status);
        } catch (error) {
            logger.error('Error Approving lead:', error);
            throw new Error('Error Approving lead');
        }
    },

    leadAssignTo: async ({ companyId, leadIds, deptId, userIds, description }: z.infer<typeof leadAssignToSchema>) => {
        try {
            const parsedData = leadAssignToSchema.safeParse({ companyId, leadIds, deptId, userIds, description });
            if (!parsedData.success) {
                const errors = parsedData.error.errors.map((err: ZodIssue) => ({
                    message: err.message,
                    path: err.path,
                }));
                return { user: null, errors };
            }
            return await leadWorker.leadAssignTo({ companyId, leadIds, deptId, userIds, description });
        } catch (error) {
            logger.error('Error Assigning lead [leadAssignTo]:', error);
            throw new Error(`${error}`);
        }
    },

    submitFeedback: async ({ nextFollowUpDate, deptId, leadId, callStatus, paymentStatus, feedback, urls, submitType, formName }: z.infer<typeof submitFeedbackSchema>, { user }: { user: z.infer<typeof loggedUserSchema> }) => {
        try {
            // const parsedData = submitFeedbackSchema.safeParse({ deptId, leadId, feedback });
            // if (!parsedData.success) {
            //     const errors = parsedData.error.errors.map((err: ZodIssue) => ([err.message, err.path]));
            //     throw new Error(errors.join(', '));
            // }
            return await leadWorker.submitFeedback({ nextFollowUpDate, deptId, leadId, callStatus, paymentStatus, feedback, urls, submitType, formName }, user.id);
        } catch (error) {
            logger.error('Error Submitting Feedback:', error);
            throw new Error('Error Submitting Feedback');
        }
    },
    getLeadBids: async ({ leadId }: { leadId: string }) => {
        try {
            return await leadWorker.getLeadBids(leadId);
        } catch (error) {
            logger.error('Error fetching lead bids:', error);
            throw new Error('Error fetching lead bids');
        }
    },
    submitBid: async ({ deptId, leadId, companyId, bidAmount, description }: z.infer<typeof leadBidSchema>, { user }: { user: z.infer<typeof loggedUserSchema> }) => {
        try {
            return await leadWorker.submitBid({ deptId, leadId, companyId, bidAmount, description, memberId: user.id }, user.id);
        } catch (error) {
            logger.error('Error Submitting Bid:', error);
            throw new Error(`Error Submitting Bid ${error}`);
        }
    },
    updateLeadFinanceStatus: async ({ leadId, financeStatus }: { leadId: string, financeStatus: boolean }, { user }: { user: z.infer<typeof loggedUserSchema> }) => {
        try {
            return await leadWorker.updateLeadFinanceStatus(leadId, financeStatus, user.id, user.companyId);
        } catch (error) {
            logger.error('Error updating lead finance status:', error);
            throw new Error(`Error updating lead finance status: ${error}`);
        }
    },
    updateLeadFollowUpDate: async ({ leadId, followUpDate }: { leadId: string, followUpDate: string }) => {
        try {
            return await leadWorker.updateLeadFollowUpDate(leadId, followUpDate);
        } catch (error) {
            logger.error('Error updating lead follow up date:', error);
            throw new Error(`Error updating lead follow up date: ${error}`);
        }
    }
};