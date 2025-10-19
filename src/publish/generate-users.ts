import { PrismaClient, Role, Gender } from '@prisma/public';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

const prisma = new PrismaClient();

interface UserData {
    email: string;
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    birthdate: Date;
    gender: Gender;
}

const users: UserData[] = [
    {
        email: 'sarah.mitchell@example.com',
        username: 'sarahmitch',
        password: 'SecurePass123!',
        firstname: 'Sarah',
        lastname: 'Mitchell',
        birthdate: new Date('1992-03-15'),
        gender: Gender.FEMALE
    },
    {
        email: 'james.cooper@example.com',
        username: 'jcooper',
        password: 'MyPassword456!',
        firstname: 'James',
        lastname: 'Cooper',
        birthdate: new Date('1988-07-22'),
        gender: Gender.MALE
    },
    {
        email: 'emma.rodriguez@example.com',
        username: 'emmarodz',
        password: 'Emma2024Secure!',
        firstname: 'Emma',
        lastname: 'Rodriguez',
        birthdate: new Date('1995-11-08'),
        gender: Gender.FEMALE
    },
    {
        email: 'michael.zhang@example.com',
        username: 'mzhang88',
        password: 'StrongPass789!',
        firstname: 'Michael',
        lastname: 'Zhang',
        birthdate: new Date('1990-01-30'),
        gender: Gender.MALE
    },
    {
        email: 'olivia.patel@example.com',
        username: 'oliviap',
        password: 'Olivia@Pass321',
        firstname: 'Olivia',
        lastname: 'Patel',
        birthdate: new Date('1993-09-12'),
        gender: Gender.FEMALE
    },
    {
        email: 'david.johnson@example.com',
        username: 'djohnson',
        password: 'David!Secure99',
        firstname: 'David',
        lastname: 'Johnson',
        birthdate: new Date('1985-05-25'),
        gender: Gender.MALE
    },
    {
        email: 'sophia.williams@example.com',
        username: 'sophiaw',
        password: 'Williams2024!',
        firstname: 'Sophia',
        lastname: 'Williams',
        birthdate: new Date('1997-02-14'),
        gender: Gender.FEMALE
    },
    {
        email: 'ryan.oconnor@example.com',
        username: 'ryanoconnor',
        password: 'Ryan@Password1',
        firstname: 'Ryan',
        lastname: "O'Connor",
        birthdate: new Date('1991-12-03'),
        gender: Gender.MALE
    },
    {
        email: 'ava.thompson@example.com',
        username: 'avathompson',
        password: 'Thompson!Pass5',
        firstname: 'Ava',
        lastname: 'Thompson',
        birthdate: new Date('1994-06-18'),
        gender: Gender.FEMALE
    },
    {
        email: 'lucas.martinez@example.com',
        username: 'lucasm',
        password: 'Lucas2024Secure!',
        firstname: 'Lucas',
        lastname: 'Martinez',
        birthdate: new Date('1989-10-07'),
        gender: Gender.MALE
    },
    {
        email: 'isabella.kim@example.com',
        username: 'isabellakim',
        password: 'Isabella@Kim88',
        firstname: 'Isabella',
        lastname: 'Kim',
        birthdate: new Date('1996-04-20'),
        gender: Gender.FEMALE
    },
    {
        email: 'noah.anderson@example.com',
        username: 'noahanderson',
        password: 'Noah!Strong123',
        firstname: 'Noah',
        lastname: 'Anderson',
        birthdate: new Date('1987-08-16'),
        gender: Gender.MALE
    },
    {
        email: 'mia.garcia@example.com',
        username: 'miagarcia',
        password: 'Mia2024Pass!',
        firstname: 'Mia',
        lastname: 'Garcia',
        birthdate: new Date('1998-01-09'),
        gender: Gender.FEMALE
    },
    {
        email: 'ethan.brown@example.com',
        username: 'ethanbrown',
        password: 'Ethan@Secure456',
        firstname: 'Ethan',
        lastname: 'Brown',
        birthdate: new Date('1986-11-28'),
        gender: Gender.MALE
    },
    {
        email: 'charlotte.lee@example.com',
        username: 'charlottelee',
        password: 'Charlotte!Pass9',
        firstname: 'Charlotte',
        lastname: 'Lee',
        birthdate: new Date('1999-07-05'),
        gender: Gender.FEMALE
    }
];

async function generateUsers() {
    console.log('Starting user generation...\n');

    for (const userData of users) {
        try {
            const hashedPassword = await bcrypt.hash(userData.password, 10);

            const user = await prisma.user.create({
                data: {
                    email: userData.email,
                    username: userData.username,
                    password: hashedPassword,
                    firstname: userData.firstname,
                    lastname: userData.lastname,
                    birthdate: userData.birthdate,
                    gender: userData.gender,
                    verifyToken: uuid(),
                    tokenCreatedAt: new Date(),
                    emailVerified: false,
                    role: Role.PUBLISHER,
                },
            });

            console.log(`✓ Created user: ${user.username} (${user.email})`);
        } catch (error) {
            console.error(`✗ Failed to create user ${userData.username}:`, error);
        }
    }

    console.log('\nUser generation completed!');
}

generateUsers()
    .catch((error) => {
        console.error('Error during user generation:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });