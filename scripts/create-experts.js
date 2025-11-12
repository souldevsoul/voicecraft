const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Creating test expert users...')

  // Create test users and expert profiles
  const experts = [
    {
      email: 'sarah.voice@voicecraft.com',
      name: 'Sarah Mitchell',
      specialization: ['voice-over', 'commercial', 'narration'],
      bio: 'Professional voice-over artist with 10+ years of experience in commercial, narration, and character work. Specializing in warm, conversational reads.',
      hourlyRate: 75,
      rating: 4.9,
      completedJobs: 156,
    },
    {
      email: 'david.audio@voicecraft.com',
      name: 'David Chen',
      specialization: ['audio-editing', 'sound-design', 'mixing'],
      bio: 'Award-winning audio engineer specializing in post-production, sound design, and mixing for podcasts, audiobooks, and commercial content.',
      hourlyRate: 85,
      rating: 4.8,
      completedJobs: 203,
    },
    {
      email: 'maria.language@voicecraft.com',
      name: 'Maria Rodriguez',
      specialization: ['translation', 'voice-over', 'localization'],
      bio: 'Multilingual voice artist and translator fluent in English, Spanish, and Portuguese. Expert in localization and culturally-adapted content.',
      hourlyRate: 65,
      rating: 4.7,
      completedJobs: 89,
    },
  ]

  for (const expertData of experts) {
    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email: expertData.email },
    })

    // Create user if doesn't exist
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: expertData.email,
          name: expertData.name,
          credits: 50000, // 500 credits starting balance
        },
      })
      console.log(`✓ Created user: ${user.name} (${user.email})`)
    } else {
      console.log(`→ User already exists: ${user.name} (${user.email})`)
    }

    // Check if expert profile exists
    const existingProfile = await prisma.expertProfile.findUnique({
      where: { userId: user.id },
    })

    if (!existingProfile) {
      // Create expert profile
      const expertProfile = await prisma.expertProfile.create({
        data: {
          userId: user.id,
          specialization: expertData.specialization,
          bio: expertData.bio,
          hourlyRate: expertData.hourlyRate,
          isAvailable: true,
          rating: expertData.rating,
          completedJobs: expertData.completedJobs,
        },
      })
      console.log(`✓ Created expert profile for ${user.name}`)
    } else {
      console.log(`→ Expert profile already exists for ${user.name}`)
    }
  }

  console.log('\n✅ Expert creation completed!')

  // Display all experts
  const allExperts = await prisma.expertProfile.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })

  console.log(`\nTotal experts in database: ${allExperts.length}`)
  allExperts.forEach(expert => {
    console.log(`  • ${expert.user.name} - ${expert.specialization.join(', ')} - Rating: ${expert.rating}`)
  })
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
