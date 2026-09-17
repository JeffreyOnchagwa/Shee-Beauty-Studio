import { Navigation } from './components/Navigation'
import { Hero } from './sections/Hero'
import { BrandIntro } from './sections/BrandIntro'
import { LashExperience } from './sections/LashExperience'
import { LashToNailTransition } from './sections/LashToNailTransition'
import { NailExperience } from './sections/NailExperience'
import { Gallery } from './sections/Gallery'
import { ServicesMenu } from './sections/ServicesMenu'
import { Offers } from './sections/Offers'
import { Contact } from './sections/Contact'
import { Footer } from './components/Footer'
import { useAnchorScroll } from './hooks/useAnchorScroll'

function App() {
  useAnchorScroll()

  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <BrandIntro />
        <LashExperience />
        <LashToNailTransition />
        <NailExperience />
        <Gallery />
        <ServicesMenu />
        <Offers />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
