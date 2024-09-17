export const swaggerOutput = {
  openapi: '3.0.0',
  info: {
    version: 'v1.0.0',
    title: 'Swagger Clyr',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: '',
    },
  ],
  paths: {
    '/policies': {
      post: {
        description: 'Create a policy',
        parameters: [
          {
            in: 'header',
            name: 'x-auth',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Authorization uuid',
          },
        ],
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Policy',
                },
              },
            },
          },
        },
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  teamId: {
                    type: 'string',
                    format: 'uuid',
                    description: 'The ID of the team',
                  },
                  isForAll: {
                    type: 'boolean',
                    description: 'If the policy applies to all',
                  },
                  conditions: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        field: {
                          type: 'string',
                          enum: ['amount', 'marchant', 'cardId', 'userId'],
                        },
                        operator: {
                          type: 'string',
                          enum: ['EQUALS', 'GREATER_THAN', 'LESS_THAN'],
                        },
                        value: {
                          type: 'string',
                          description:
                            'The value for the condition (string representation even for numbers)',
                        },
                      },
                      required: ['field', 'operator', 'value'],
                    },
                    description: 'Array of conditions for the policy',
                  },
                  hierarchyRequirements: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        hierarchy: {
                          type: 'integer',
                          description: 'The hierarchy level',
                        },
                        minApprovers: {
                          type: 'integer',
                          description: 'Minimum number of approvers required',
                        },
                      },
                      required: ['hierarchy', 'minApprovers'],
                    },
                  },
                  approvers: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        userId: {
                          type: 'string',
                          format: 'uuid',
                          description:
                            'The ID of the user (only one between userId and role is allowed)',
                        },
                        role: {
                          type: 'string',
                          description:
                            'The role of the approver (only one between userId and role is allowed)',
                        },
                        hierarchy: {
                          type: 'integer',
                          description: 'The hierarchy level of the approver',
                        },
                      },
                      required: ['hierarchy'],
                      oneOf: [{ required: ['userId'] }, { required: ['role'] }],
                    },
                  },
                },
                required: ['teamId', 'hierarchyRequirements', 'approvers'],
                additionalProperties: false,
              },
            },
          },
        },
      },
    },
    '/transactions/webhooks': {
      post: {
        description: '',
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Transaction',
                },
              },
            },
          },
        },
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  merchant: {
                    example: 'Home Depot',
                    type: 'string',
                  },
                  amount: {
                    example: '1000',
                    type: 'string',
                  },
                  cardId: {
                    example: 'ecc3184d-41be-4228-8e56-13ea6d6a5483',
                    type: 'string',
                  },
                  teamId: {
                    example: 'ecc3184d-41be-4228-8e56-13ea6d6a5483',
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
    },
    '/transactions/{transactionId}/status': {
      post: {
        description: '',
        parameters: [
          {
            in: 'header',
            name: 'x-auth',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Authorization uuid',
          },
          {
            name: 'transactionId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
          },
          {
            name: 'approverId',
            in: 'query',
            schema: {
              type: 'string',
            },
          },
          {
            name: 'policyId',
            in: 'query',
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Transaction',
                },
              },
            },
          },
        },
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    example: 'APPROVED',
                    enum: ['APPROVED', 'PENDING', 'REJECTED'],
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
      },
    },
    schemas: {
      Policy: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
          team: {
            $ref: '#/components/schemas/Team',
          },
          teamId: {
            type: 'string',
            format: 'uuid',
          },
          isForAll: {
            type: 'boolean',
          },
          conditions: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Condition',
            },
          },
          approvers: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Approver',
            },
          },
          approvalRequests: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/ApprovalRequest',
            },
          },
          hierarchyRequirements: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/HierarchyRequirement',
            },
          },
        },
      },
      Team: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
          name: {
            type: 'string',
          },
        },
      },
      Condition: {
        type: 'object',
        properties: {
          field: {
            type: 'string',
          },
          operator: {
            type: 'string',
          },
          value: {
            type: 'string',
          },
        },
      },
      Approver: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            format: 'uuid',
          },
          role: {
            type: 'string',
          },
          hierarchy: {
            type: 'integer',
          },
        },
      },
      ApprovalRequest: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
          status: {
            type: 'string',
          },
        },
      },
      HierarchyRequirement: {
        type: 'object',
        properties: {
          hierarchy: {
            type: 'integer',
          },
          minApprovers: {
            type: 'integer',
          },
        },
      },
      Transaction: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
          team: {
            $ref: '#/components/schemas/Team',
          },
          teamId: {
            type: 'string',
            format: 'uuid',
          },
          card: {
            $ref: '#/components/schemas/Card',
          },
          cardId: {
            type: 'string',
            format: 'uuid',
          },
          amount: {
            type: 'number',
            format: 'float',
          },
          datetime: {
            type: 'string',
            format: 'date-time',
          },
          merchant: {
            type: 'string',
          },
          status: {
            type: 'string',
            enum: ['PENDING', 'APPROVED', 'REJECTED'],
          },
          approvalRequests: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/ApprovalRequest',
            },
          },
        },
      },
      Card: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
          number: {
            type: 'string',
          },
        },
      },
    },
  },
};
