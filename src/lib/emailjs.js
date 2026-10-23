import emailjs from '@emailjs/browser'

// Configuration EmailJS pour POPLOVE
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_ac0bu9b',
  TEMPLATE_ID: 'template_awq0s5i',
  PUBLIC_KEY: 'D_cGtF4U-z_mmbtYg'
}

// Fonction d'envoi du message de contact
export const sendContactEmail = async (formData) => {
  try {
    const templateParams = {
      user_name: formData.name,
      user_email: formData.email,
      user_phone: formData.phone || 'Non renseigné',
      subject: formData.subject,
      message: formData.message,
      date: new Date().toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    )

    console.log('✅ Email envoyé avec succès:', response)
    return { success: true, response }
  } catch (error) {
    console.error('❌ Erreur EmailJS:', error)
    return { success: false, error: error.text || 'Erreur inconnue' }
  }
}