export interface VideoGenerator {
  id: string
  name: string
  description: string
  enabled: boolean
  priority: number
  apiEndpoint?: string
  supportedFeatures: {
    textToVideo: boolean
    customStyles?: boolean
  }
}

export interface GeneratorConfig {
  generators: VideoGenerator[]
  defaultGenerator: string
  fallbackGenerators: string[]
}

export const defaultGeneratorConfig: GeneratorConfig = {
  generators: [
    {
      id: 'pika-kling-3-turbo',
      name: 'Pika Kling 3.0 Turbo',
      description:
        'AI text-to-video generation powered by Pika Kling 3.0 Turbo.',
      enabled: true,
      priority: 1,
      supportedFeatures: {
        textToVideo: true,
        customStyles: true,
      },
    },
  ],
  defaultGenerator: 'pika-kling-3-turbo',
  fallbackGenerators: [],
}

export function getActiveGenerators(
  config?: GeneratorConfig
): VideoGenerator[] {
  const cfg = config ?? defaultGeneratorConfig

  return cfg.generators
    .filter((generator) => generator.enabled)
    .sort((a, b) => a.priority - b.priority)
}

export function getGeneratorById(
  id: string,
  config?: GeneratorConfig
): VideoGenerator | undefined {
  const cfg = config ?? defaultGeneratorConfig

  return cfg.generators.find(
    (generator) => generator.id === id
  )
}

export function getGeneratorsByFeature(
  feature: keyof VideoGenerator['supportedFeatures'],
  config?: GeneratorConfig
): VideoGenerator[] {
  const cfg = config ?? defaultGeneratorConfig

  return cfg.generators.filter(
    (generator) =>
      generator.enabled &&
      generator.supportedFeatures[feature] === true
  )
}

export function addVideoGenerator(
  generator: VideoGenerator
): VideoGenerator {
  return { ...generator }
}

export function updateGeneratorConfig(
  generatorId: string,
  updates: Partial<VideoGenerator>,
  config?: GeneratorConfig
): GeneratorConfig {
  const cfg = config ?? defaultGeneratorConfig

  return {
    ...cfg,
    generators: cfg.generators.map((generator) =>
      generator.id === generatorId
        ? { ...generator, ...updates }
        : generator
    ),
    fallbackGenerators: [
      ...cfg.fallbackGenerators,
    ],
  }
}