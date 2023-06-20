import { extendType, objectType, nonNull, stringArg } from 'nexus'

// objectType is used to create a new type in your GraphQL schema
export const Link = objectType({
    name: 'Link',                           // 1: The name option defines the name of the type
    definition(t) {                         // 2: Inside the definition, you can add different fields that get added to the type
        t.nonNull.int("id");                // 3: This adds a field named id of type Int
        t.nonNull.string("description");    // 4: This adds a field named description of type String
        t.nonNull.string("url")             // 5: This adds a field named url of type String
        t.field("postedBy", {   // 1
            type: "User",
            resolve(parent, args, context) {  // 2
                return context.prisma.link
                    .findUnique({ where: { id: parent.id } })
                    .postedBy();
            },
        });
    },
});

// let links: NexusGenObjects["Link"][] = [  // 1
//     {
//         id: 1,
//         url: "www.howtographql.com",
//         description: "Fullstack tutorial for GraphQL",
//     },
//     {
//         id: 2,
//         url: "graphql.org",
//         description: "GraphQL official website",
//     },
// ]

export const LinkQuery = extendType({  // 2
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("feed", {   // 3
            type: "Link",
            resolve(parent, args, context, info) {    // 4
                return context.prisma.link.findMany();
            },
        });
    },
});

export const LinkMutation = extendType({  
    type: "Mutation",    
    definition(t) {
        t.nonNull.field("post", {  
            type: "Link",  
            args: {   
                description: nonNull(stringArg()),
                url: nonNull(stringArg()),
            },
            
            async resolve(parent, args, context) {    
                const { description, url } = args; 
                const { userId } = context;

                if (!userId) {  
                    throw new Error("Cannot post without logging in.");
                }
                
                const newLink = await context.prisma.link.create({
                    data: {
                        description: description,
                        url: url,
                        postedBy: { connect: { id: userId } },
                    },
                });
                return newLink;
            },
        });
    },
});